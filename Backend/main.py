import os.path
import typing
from tkinter import EXCEPTION

import fastapi
import ormar
import uvicorn
from fastapi import HTTPException, Depends

import exceptions
import models
import serializers
import settings
from auth import oauth2_scheme
from routes import users
from models import database
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI(
    debug=settings.DEBUG,
    title='TravelAgency Backend',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)


# Эндпоинты для туров
@app.post("/tours/", name='Создать тур')
async def create_tour(tour: serializers.TourCreate):
    try:
        return await models.Tour.objects.create(**tour.dict())
    except Exception as e :
        print(e)
        raise HTTPException(status_code=400, detail="Тур уже существует")


@app.get("/tours/", name='Получить туры')
async def get_tours():
    return await models.Tour.objects.all()

@app.get("/tour/{tour_id}/", name='Вывод тура')
async def get_tour(tour_id: int):
    tour = await models.Tour.objects.get_or_none(id=tour_id)
    if not tour:
        raise HTTPException(status_code=404, detail="Тур не найден.")

    return tour


# Эндпоинты для бронирований
@app.post("/bookings/", name='Заказы')
async def create_booking(
        booking: serializers.BookingCreate,
        token: str = Depends(oauth2_scheme)
):
    # В реальном приложении здесь проверка токена
    user = await models.User.objects.get(id=1)  # Заглушка - получаем первого пользователя

    try:
        tour = await models.Tour.objects.get(id=booking.tour_id)
    except ormar.exceptions.NoMatch:
        raise HTTPException(status_code=404, detail="Тур не найден")

    return await models.Booking.objects.create(
        user=user,
        tour=tour,
        status=booking.status
    )



@app.on_event('startup')
async def on_startup():
    await database.connect()


@app.on_event('shutdown')
async def on_shutdown():
    if database.is_connected:
        await database.disconnect()


@app.get(f'/{settings.STATIC_URL}' + '/{file_path:path}', name='Вывод static-файлов для фронтенда')
async def get_static(file_path: str):
    file_path = settings.get_static_file_path(file_path)
    return fastapi.responses.FileResponse(file_path)


@app.get(f'/{settings.MEDIA_URL}' + '/{file_path:path}', name='Вывод media-файлов для фронтенда')
async def get_media(file_path: str):
    file_path = settings.get_media_file_path(file_path)
    return fastapi.responses.FileResponse(file_path)


@app.post(f'/{settings.MEDIA_URL}', name='Загрузка media-файлов')
async def upload_media(
        file: fastapi.UploadFile,
        file_dir: typing.Literal['avatar'],
):
    paths = [file_dir or '', file.filename]
    file_path = settings.get_media_file_path(*paths)

    if settings.path_exists(path=file_path):
        raise exceptions.MEDIA_ALREADY_UPLOADED

    with open(file_path, 'wb') as f:
        f.write(file.file.read())

    return {'detail': settings.get_relpath(file_path)}


if __name__ == '__main__':
    uvicorn.run(
        host=settings.HOST,
        port=settings.PORT,
        app=app
    )

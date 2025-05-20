import typing
import fastapi
import uvicorn
import exceptions
import settings
from routes import users, tours, bookings
import auth
from models import database
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI(
    debug=settings.DEBUG,
    title='Tour Backend',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(tours.router)
app.include_router(auth.router)
app.include_router(bookings.router)


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
        file_dir: typing.Literal['avatar', 'patients', 'meetings'],
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
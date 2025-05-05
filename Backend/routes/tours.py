from fastapi import APIRouter
from datetime import datetime

import exceptions
import models
import serializers

router = APIRouter(
    prefix="/tours",
    tags=["Туры"],
)

@router.post("/", name="Создание тура")
async def create_tour(tour_data: serializers.TourCreateModel) -> models.Tour:
    return await models.Tour.objects.create(**tour_data.model_dump())


@router.get("/", name="Вывод списка доступных туров")
async def get_tours() -> list[models.Tour]:
    current_date = datetime.now()
    return await models.Tour.objects.select_all(False).filter(
        date_expires__lte=current_date
    ).all()

@router.get('/{tour_id}/', name="Вывод конкретного тура по ID")
async def get_tour_by_id(tour_id: int) -> models.Tour:
    current_date = datetime.now()
    tour = await models.Tour.objects.select_all(False).get_or_none(
        id=tour_id,
        date_expires__lte=current_date,
    )

    if not tour:
        raise exceptions.TOUR_NOT_FOUND

    return tour


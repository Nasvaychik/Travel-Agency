from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime, timezone, timedelta

from models import Booking, Tour, User, BookingStatuses
import auth
from serializers import BookingCreate, BookingResponse

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/")
async def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(auth.get_current_user)
):
    # Проверяем существование тура
    tour = await Tour.objects.get_or_none(id=booking_data.tour_id)
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Тур не найден"
        )
    
    # Проверяем даты
    if booking_data.check_in_date >= booking_data.check_out_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Дата выезда должна быть позже даты заезда"
        )
    
    if booking_data.check_in_date < datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Дата заезда не может быть в прошлом"
        )
    
    # Создаем бронирование
    booking = await Booking.objects.create(
        check_in_date=booking_data.check_in_date,
        check_out_date=booking_data.check_out_date,
        client=current_user,
        tour=tour,
        total_price=tour.base_price * booking_data.travelers,
        status=BookingStatuses.PENDING,
        room=booking_data.room
    )
    
    return booking

@router.get("/my")
async def get_my_bookings(current_user: User = Depends(auth.get_current_user)):
    bookings = await Booking.objects.filter(client=current_user).all()
    return bookings

@router.get("/{booking_id}")
async def get_booking(
    booking_id: int,
    current_user: User = Depends(auth.get_current_user)
):
    booking = await Booking.objects.select_related(['client', 'tour']).get_or_none(id=booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Бронирование не найдено"
        )
    
    if booking.client.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к этому бронированию"
        )
    
    return booking

@router.patch("/{booking_id}/cancel")
async def cancel_booking(
    booking_id: int,
    current_user: User = Depends(auth.get_current_user)
):
    booking = await Booking.objects.get_or_none(id=booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Бронирование не найдено"
        )
    
    if booking.client.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к этому бронированию"
        )
    
    if booking.status != BookingStatuses.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Можно отменить только ожидающие бронирования"
        )
    
    booking.status = BookingStatuses.CANCELLED
    await booking.update()
    return booking 
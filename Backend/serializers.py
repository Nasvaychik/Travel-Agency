import pydantic

import models
from pydantic import BaseModel
from datetime import date, datetime

class Model(BaseModel):
    pass

TourCreateModel = models.Tour.get_pydantic(
    exclude={
        'id',
        'date_created',
        'bookings'
    }
)

TourUpdateModel = models.Tour.get_pydantic_partial(
    exclude={
        'id',
        'date_created',
    }
)


UserRegistrationModel = models.User.get_pydantic(
    include={
        'password',
        'email',
        'first_name',
        'last_name',
        'surname',
    }
)

UserLoginModel = models.User.get_pydantic(
    include={
        'email',
        'password',
    }
)

UserFetchSerializer = models.User.get_pydantic(
    include={
        'email',
        'first_name',
        'last_name',
        'surname',
        'id',
    }
)

UserUpdateSerializer = models.User.get_pydantic_partial(
    include={
        'first_name',
        'last_name',
        'surname',
    }
)



class UserPasswordChangeSerializer(Model):
    old_password: str = pydantic.Field(title="Старый пароль")
    new_password: str = pydantic.Field(title="Новый пароль")

class TourResponse(pydantic.BaseModel):
    id: int
    name: str
    base_price: float
    desc: str
    featured: bool
    cover_image: str
    city: str
    avg_rating: float
    date_created: datetime
    date_expires: datetime

    class Config:
        orm_mode = True

class BookingCreate(pydantic.BaseModel):
    tour_id: int
    check_in_date: datetime
    check_out_date: datetime

class BookingResponse(pydantic.BaseModel):
    id: int
    date_created: datetime
    check_in_date: datetime
    check_out_date: datetime
    total_price: float
    status: str
    tour: TourResponse

    class Config:
        orm_mode = True

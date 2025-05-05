import databases
import ormar
from datetime import datetime, date
from typing import Optional, Union, Dict, Set, Type
from enum import Enum

import pydantic
import sqlalchemy
from sqlalchemy_utils import database_exists, create_database, drop_database
import settings

metadata = sqlalchemy.MetaData()
database = databases.Database(settings.DATABASE_URL)

#drop_database(settings.DATABASE_URL)
if not database_exists(settings.DATABASE_URL):
    database_inited = False
    create_database(settings.DATABASE_URL)

engine = sqlalchemy.create_engine(settings.DATABASE_URL)

base_ormar_config = ormar.OrmarConfig(
    metadata=metadata,
    database=database,
)


class GenderChoices(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class BookingStatuses(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class PartialMixin:
    """
    Mixin для создания сериализаторов без обязательных полей
    для возможности обновления данных без валидации.
    """

    @classmethod
    def get_pydantic_partial(
            cls,
            *,
            include: Union[Set, Dict, None] = None,
            exclude: Union[Set, Dict, None] = None,
    ) -> Type[pydantic.BaseModel]:
        model = cls.get_pydantic(include=include, exclude=exclude)

        new_fields = {
            name: (Optional[model.__annotations__.get(name)], None)
            for name in model.__fields__
        }

        new_model = pydantic.create_model(f"Partial{cls.__name__}", **new_fields)
        return new_model


class Destination(PartialMixin, ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='destinations')

    id: int = ormar.BigInteger(primary_key=True, autoincrement=True)
    name: str = ormar.String(max_length=150, nullable=False)
    description: str = ormar.Text(nullable=True)
    climate: str = ormar.String(max_length=100, nullable=True)
    visa_requirements: bool = ormar.Boolean(default=False)
    is_active: bool = ormar.Boolean(default=True)

class Tour(PartialMixin, ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='tours')

    id: int = ormar.BigInteger(primary_key=True, autoincrement=True)
    date_created: datetime = ormar.DateTime(nullable=False, default=datetime.now)
    date_expires: datetime = ormar.DateTime(nullable=False)
    name: str = ormar.String(max_length=200, nullable=False)
    base_price: float = ormar.Decimal(max_digits=12, decimal_places=2, nullable=False)
    desc: str = ormar.Text(nullable=False)
    featured: bool = ormar.Boolean(default=True, nullable=False)
    cover_image: str = ormar.Text(nullable=False, default="")
    city: str = ormar.String(nullable=False, max_length=100)
    avg_rating: float = ormar.Decimal(decimal_places=2, max_digits=3, nullable=False, default=0.0)


class RoomType(PartialMixin, ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='room_types')

    id: int = ormar.BigInteger(primary_key=True, autoincrement=True)
    name: str = ormar.String(max_length=128, nullable=False)
    description: Optional[str] = ormar.Text(nullable=True)
    capacity: int = ormar.Integer(nullable=False)


class Hotel(PartialMixin, ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='hotels')

    id: int = ormar.BigInteger(primary_key=True, autoincrement=True)
    name: str = ormar.String(max_length=200, nullable=False)
    stars: Optional[int] = ormar.Integer(minimum=1, maximum=5, nullable=True)
    address: str = ormar.Text(nullable=False)
    destination: Destination = ormar.ForeignKey(Destination, nullable=False)


class HotelRoom(PartialMixin, ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='hotel_rooms')

    id: int = ormar.BigInteger(primary_key=True, autoincrement=True)
    hotel: Hotel = ormar.ForeignKey(Hotel, nullable=False)
    room_type: RoomType = ormar.ForeignKey(RoomType, nullable=False)
    room_number: str = ormar.String(max_length=20, nullable=False)
    price_per_night: float = ormar.Decimal(max_digits=10, decimal_places=2, nullable=False)


class User(PartialMixin, ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='users')

    id: int = ormar.BigInteger(primary_key=True, autoincrement=True)
    first_name: str = ormar.String(max_length=50, nullable=False)
    last_name: str = ormar.String(max_length=50, nullable=False)
    surname: Optional[str] = ormar.String(max_length=50, nullable=True)
    email: str = ormar.String(max_length=250, regex=r"^\S+@\S+\.\S+$", nullable=False)
    password: str = ormar.Text(nullable=False)


class Booking(PartialMixin, ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='bookings')

    id: int = ormar.BigInteger(primary_key=True, autoincrement=True)
    date_created: datetime = ormar.DateTime(default=datetime.now, nullable=False)
    check_in_date: datetime = ormar.DateTime(nullable=False)
    check_out_date: datetime = ormar.DateTime(nullable=False)
    client: User = ormar.ForeignKey(User, nullable=False)
    tour: Optional[Tour] = ormar.ForeignKey(Tour, nullable=True)
    room: Optional[HotelRoom] = ormar.ForeignKey(HotelRoom, nullable=True)
    total_price: float = ormar.Decimal(max_digits=12, decimal_places=2, nullable=False)
    status: BookingStatuses = ormar.String(
        max_length=20,
        choices=list(BookingStatuses),
        default=BookingStatuses.CONFIRMED,
        nullable=False
    )

metadata.create_all(bind=engine)
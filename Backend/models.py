import enum
from typing import Type, Union, Set, Optional, Dict
import ormar
import random
import pydantic
import sqlalchemy
import databases
import settings
import urllib.request
from datetime import datetime, timedelta, date
from sqlalchemy_utils import drop_database, create_database, database_exists

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


def get_med_card_expire_date():
    return datetime.now() + timedelta(days=10 * 365)


def get_default_avatar():
    random_seed = random.randint(100, 99999999)
    url = f'https://api.dicebear.com/7.x/miniavs/svg?seed={random_seed}'

    image_save_path, rel_path = settings.get_avatar_save_path(f'{random_seed}.svg')

    urllib.request.urlretrieve(
        url=url,
        filename=image_save_path,
    )

    return rel_path

class GenderChoices(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class BookingStatuses(str, enum.Enum):
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
    is_active: bool = ormar.Boolean(default=True)


class Tour(PartialMixin, ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='tours')

    id: int = ormar.BigInteger(primary_key=True, autoincrement=True)
    featured: bool = ormar.Boolean(default=True)
    city: str = ormar.String(max_length=200, nullable=False)
    avgRating: float = ormar.Decimal(max_digits=3, decimal_places=2)
    desc: str = ormar.Text(nullable=True)
    date_created: date = ormar.Date(nullable=False)
    date_expires: date = ormar.Date(nullable=False)
    name: str = ormar.String(max_length=200, nullable=False)
    base_price: float = ormar.Decimal(max_digits=12, decimal_places=2, nullable=False)
    cover_image: str = ormar.String(
        max_length=500,
        nullable=True,
        default="https://i.pinimg.com/736x/2d/a7/00/2da700815853f66a793a749d2ed1cd4c.jpg",
        regex=r"^(https?://|/).+\.(jpg|jpeg|png|webp)$"
    )


class User(PartialMixin, ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='users')

    id: int = ormar.BigInteger(primary_key=True, autoincrement=True)
    first_name: str = ormar.String(max_length=50, nullable=False)
    last_name: str = ormar.String(max_length=50, nullable=False)
    surname: Optional[str] = ormar.String(max_length=50, nullable=True)
    password = ormar.Text(nullable=False)
    email: str = ormar.String(max_length=250, regex=r"^\S+@\S+\.\S+$", nullable=False)


class Booking(PartialMixin, ormar.Model):
    ormar_config = base_ormar_config.copy(tablename='bookings')

    id: int = ormar.BigInteger(primary_key=True, autoincrement=True)
    date_created: datetime = ormar.DateTime(default=datetime.now, nullable=False)
    check_in_date: date = ormar.Date(nullable=False)
    check_out_date: date = ormar.Date(nullable=False)
    user: User = ormar.ForeignKey(User, nullable=False)
    tour: Optional[Tour] = ormar.ForeignKey(Tour, nullable=True)
    total_price: float = ormar.Decimal(max_digits=12, decimal_places=2, nullable=False)
    status: BookingStatuses = ormar.String(
        max_length=20,
        choices=list(BookingStatuses),
        default=BookingStatuses.CONFIRMED,
        nullable=False
    )


# metadata.drop_all(bind=engine)
metadata.create_all(bind=engine)
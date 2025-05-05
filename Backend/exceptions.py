import fastapi


TOUR_NOT_FOUND = fastapi.HTTPException(
    detail="Запрашиваемый Вами тур не был найден!",
    status_code=404,
)

MEDIA_ALREADY_UPLOADED = fastapi.HTTPException(
    detail="Данный медиа-файл уже был загружен.",
    status_code=400,
)

INCORRECT_LOGIN_DATA_EXCEPTION = fastapi.HTTPException(
    detail="Неверные данные для входа в аккаунт",
    status_code=400,
)

INCORRECT_REGISTRATION_DATA_EXCEPTION = fastapi.HTTPException(
    detail="Неверные данные для регистрации аккаунта",
    status_code=400,
)

USER_ALREADY_REGISTERED_EXCEPTION = fastapi.HTTPException(
    detail="Данный пользователь уже зарегистрирован в системе",
    status_code=400,
)

PASSWORD_INVALID = fastapi.HTTPException(
    detail="Неверно введен пароль",
    status_code=400,
)

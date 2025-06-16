import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { app } from "../app";

const Payment = () => {
  const { user } = useContext(AppContext);
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await app.get(`/bookings/${bookingId}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке бронирования:", error);
        toast.error("Ошибка при загрузке деталей бронирования.");
        navigate("/profile"); // Перенаправить на профиль, если бронирование не найдено
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    } else {
      toast.error("Идентификатор бронирования не указан.");
      navigate("/profile");
    }
  }, [bookingId, user, navigate]);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Валидация номера карты
    const cardNumberCleaned = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardNumberCleaned) {
      errors.cardNumber = "Номер карты обязателен.";
      isValid = false;
    } else if (!/^[0-9]{16}$/.test(cardNumberCleaned)) {
      errors.cardNumber = "Номер карты должен содержать 16 цифр.";
      isValid = false;
    }

    // Валидация срока действия
    if (!cardDetails.expiryDate) {
      errors.expiryDate = "Срок действия обязателен.";
      isValid = false;
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardDetails.expiryDate)) {
      errors.expiryDate = "Неверный формат (ММ/ГГ).";
      isValid = false;
    } else {
      const [month, year] = cardDetails.expiryDate.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100; // Последние 2 цифры года
      const currentMonth = new Date().getMonth() + 1; // Месяцы от 1 до 12

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiryDate = "Срок действия карты истек.";
        isValid = false;
      }
    }

    // Валидация CVV
    if (!cardDetails.cvv) {
      errors.cvv = "CVV обязателен.";
      isValid = false;
    } else if (!/^[0-9]{3,4}$/.test(cardDetails.cvv)) {
      errors.cvv = "CVV должен содержать 3 или 4 цифры.";
      isValid = false;
    }

    // Валидация имени владельца карты
    if (!cardDetails.cardHolderName) {
      errors.cardHolderName = "Имя владельца карты обязательно.";
      isValid = false;
    } else if (!/^[а-яА-ЯёЁa-zA-Z\s]+$/.test(cardDetails.cardHolderName)) {
      errors.cardHolderName = "Имя владельца карты должно содержать только буквы и пробелы.";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    } else if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      formattedValue = formattedValue.slice(0, 5);
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: formattedValue,
    }));

    // Валидация при каждом изменении
    setValidationErrors(prevErrors => ({
        ...prevErrors,
        [name]: null // Очищаем ошибку при изменении поля
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Пожалуйста, исправьте ошибки в форме.");
      return;
    }

    setPaymentLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Оплата успешно завершена!");
      navigate(`/invoice/${bookingId}`);
    } catch (error) {
      console.error("Ошибка при оплате:", error);
      toast.error("Произошла ошибка при обработке платежа.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const isFormValid = Object.keys(validationErrors).every(key => !validationErrors[key]) &&
                      Object.values(cardDetails).every(value => value.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка страницы оплаты...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Бронирование не найдено.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Оплата бронирования
        </h2>
        
        {/* Информация о бронировании */}
        <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Детали бронирования</h3>
          <p className="text-gray-700">Тур: <span className="font-medium">{booking.tour.name}</span></p>
          <p className="text-gray-700">Дата заезда: <span className="font-medium">{new Date(booking.check_in_date).toLocaleDateString("ru-RU")}</span></p>
          <p className="text-gray-700">Дата выезда: <span className="font-medium">{new Date(booking.check_out_date).toLocaleDateString("ru-RU")}</span></p>
          <p className="text-gray-700">Количество путешественников: <span className="font-medium">{Math.round(booking.total_price / booking.tour.base_price)}</span></p>
          <p className="text-lg font-bold text-gray-900 mt-2">Общая стоимость: <span className="text-blue-600">₽{booking.total_price.toLocaleString()}</span></p>
        </div>

        {/* Форма оплаты */}
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Номер карты
            </label>
            <input
              type="text"
              name="cardNumber"
              id="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleCardChange}
              maxLength="19" // 16 цифр + 3 пробела
              placeholder="XXXX XXXX XXXX XXXX"
              className={`mt-1 block w-full px-3 py-2 border ${validationErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {validationErrors.cardNumber && <p className="mt-1 text-sm text-red-500">{validationErrors.cardNumber}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Срок действия (ММ/ГГ)
              </label>
              <input
                type="text"
                name="expiryDate"
                id="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleCardChange}
                maxLength="5" // ММ/ГГ
                placeholder="ММ/ГГ"
                className={`mt-1 block w-full px-3 py-2 border ${validationErrors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              />
              {validationErrors.expiryDate && <p className="mt-1 text-sm text-red-500">{validationErrors.expiryDate}</p>}
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                id="cvv"
                value={cardDetails.cvv}
                onChange={handleCardChange}
                maxLength="4" // Обычно 3 или 4 цифры
                placeholder="XXX"
                className={`mt-1 block w-full px-3 py-2 border ${validationErrors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                required
              />
              {validationErrors.cvv && <p className="mt-1 text-sm text-red-500">{validationErrors.cvv}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700">
              Имя владельца карты
            </label>
            <input
              type="text"
              name="cardHolderName"
              id="cardHolderName"
              value={cardDetails.cardHolderName}
              onChange={handleCardChange}
              placeholder="Иван Иванов"
              className={`mt-1 block w-full px-3 py-2 border ${validationErrors.cardHolderName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {validationErrors.cardHolderName && <p className="mt-1 text-sm text-red-500">{validationErrors.cardHolderName}</p>}
          </div>

          <motion.button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={paymentLoading || !isFormValid}
          >
            {paymentLoading ? "Обработка платежа..." : `Оплатить ₽${booking.total_price.toLocaleString()}`}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Payment; 
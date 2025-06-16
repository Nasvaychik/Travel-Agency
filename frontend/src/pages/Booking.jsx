import React, { useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { app } from "../app";
import HotelCardMini from "../components/HotelCardMini";

function Booking() {
  const { user } = useContext(AppContext);
  const location = useLocation();
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState(null);

  const [formData, setFormData] = useState({
    phone: "",
    travelers: 1,
    special_requests: "",
    room: 0,
    check_in_date: "",
    check_out_date: "",
  });

  const totalPrice = useMemo(() => {
    const price = tour?.base_price || 0;
    const travelers = formData.travelers ? +formData.travelers : 1;

    return price * travelers;
  }, [tour, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const loadTourHotelRooms = async (tourId) => {
    setLoading(true);
    const response = await app.get(`/tours/${tourId}/rooms`);
    setLoading(false);
    setRooms(response.data);
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      const response = await app.post(
        `/bookings`,
        {
          ...formData,
          tour_id: tour.id,
        },
      );

      if (response.status > 200) {
        throw new Error(response.data.message || "Failed to create booking");
      }

      const data = await response.data;

      toast.success("Booking successful!");
      navigate(`/payment/${data.id}`);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Ошибка: " + error.message);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await app.get(`/tours/${+tourId}/`);
        setTour(response.data);
        return response.data;
      } catch (err) {
        toast.error(err.response?.data?.detail || "Ошибка загрузки тура");
      } finally {
        setLoading(false);
      }
    };

    fetchTour().then((data) => {
      setTour(data);
      loadTourHotelRooms(data.id);
    });
  }, []);

  if (!user) {
    return navigate("/login");
  }

  if (!tour && loading) {
    // Если тура нет или еще не по
    return null;
  }

  if (!tour && !loading) {
    return <span>Тур не был найден!</span>;
  }

  return user ? (
    <motion.div
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto p-6 rounded-lg"
      variants={formVariants}
      style={{ display: "flex", flexDirection: "column", gap: "30px" }}
    >
      <div
        className="shadow-lg rounded-lg"
        style={{ position: "relative", width: "850px", height: "300px" }}
      >
        <img
          src={tour.cover_image}
          className="rounded-lg"
          style={{
            aspectRatio: "16x9",
            objectFit: "cover",
            width: "inherit",
            height: "inherit",
            position: "absolute",
            top: "0%",
            left: "0%",
          }}
        />
        <span
          style={{
            position: "relative",
            top: "75%",
            left: "5%",
            fontWeight: "bold",
            fontSize: "35px",
          }}
        >
          {tour.name}
        </span>
      </div>
      <motion.div
        className="mx-auto p-6 bg-white/20 rounded-lg  shadow-lg"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        style={{ width: "100%" }}
      >
        <h2 className="text-3xl font-bold mb-6">
          Забронируйте Свой тур: {tour.title}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-semibold">
              Номер телефона
            </label>
            <motion.input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-inherit"
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold">
              Количество путешественников
            </label>
            <motion.input
              type="number"
              name="travelers"
              min="1"
              value={formData.travelers}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-inherit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold">Дата заезда</label>
            <motion.input
              type="datetime-local"
              name="check_in_date"
              value={formData.checkInDate}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-inherit"
              required
              min={new Date().toISOString().slice(0, 16)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold">Дата выезда</label>
            <motion.input
              type="datetime-local"
              name="check_out_date"
              value={formData.checkOutDate}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-inherit"
              required
              min={
                formData.checkInDate || new Date().toISOString().slice(0, 16)
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold">
              Особые пожелания (по желанию)
            </label>
            <motion.textarea
              name="special_requests"
              value={formData.specialRequests}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-inherit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div>
            <HotelCardMini
              data={rooms}
              onSelect={(roomId) =>
                setFormData((prev) => ({ ...prev, room: +roomId }))
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Общая стоимость: ₽{totalPrice}
            </h3>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-b from-sky-500 to-blue-500 text-white hover:from-sky-800 hover:to-blue-700  p-3 rounded-lg bg-inherit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Подтвердите бронирование
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  ) : (
    <div className="text-center mt-20">
      Пожалуйста, войдите в систему, чтобы сделать заказ.
    </div>
  );
}

export default Booking;

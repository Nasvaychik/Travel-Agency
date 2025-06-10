import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { app } from "../app";
import { motion } from "framer-motion";
import { Calendar, DollarSign, MapPin, Users, CheckCircle, XCircle, User, Mail, CreditCard } from "lucide-react";

const Profile = () => {
  const { user, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await app.get("/bookings/user/");
        setBookings(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке бронирований:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl mb-8 border border-white/20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Личный кабинет
              </h1>
              <p className="text-gray-600 mt-1">Управление вашими бронированиями</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/50 rounded-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Имя</p>
                  <p className="font-semibold text-lg">{user.first_name} {user.last_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-lg">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Мои бронирования</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-600">
                У вас пока нет забронированных туров
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Найти тур
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/60 hover:bg-white/80 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-white/20"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1 space-y-4">
                      <h3 className="text-2xl font-bold text-gray-800">{booking.tour.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-lg">
                          <Calendar className="text-blue-600" />
                          <span className="text-gray-700">
                            {new Date(booking.check_in_date).toLocaleDateString("ru-RU")} -{" "}
                            {new Date(booking.check_out_date).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 bg-purple-50/50 p-3 rounded-lg">
                          <Users className="text-purple-600" />
                          <span className="text-gray-700">{booking.travelers} путешественников</span>
                        </div>
                        <div className="flex items-center gap-3 bg-green-50/50 p-3 rounded-lg">
                          <DollarSign className="text-green-600" />
                          <span className="text-gray-700">₽{booking.total_price}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-orange-50/50 p-3 rounded-lg">
                          {booking.is_paid ? (
                            <>
                              <CheckCircle className="text-green-600" />
                              <span className="text-green-700 font-medium">Оплачено</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="text-red-600" />
                              <span className="text-red-700 font-medium">Ожидает оплаты</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/invoice/${booking.id}`)}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                      >
                        Счет
                      </button>
                      {!booking.is_paid && (
                        <button
                          onClick={() => navigate(`/payment/${booking.id}`)}
                          className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                        >
                          Оплатить
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 
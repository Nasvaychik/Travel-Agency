import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { app } from "../app";
import { Calendar, Download, MapPin, Users, User, Mail, Plane, DollarSign, Globe } from "lucide-react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20 },
  section: { marginBottom: 10 },
  label: { fontWeight: "bold" },
});

const BookingPDF = ({ booking }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Счет за бронирование</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Информация о клиенте</Text>
        <Text>Имя: {booking.client.first_name} {booking.client.last_name}</Text>
        <Text>Email: {booking.client.email}</Text>
        <Text>Телефон: {booking.phone}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Детали тура</Text>
        <Text>Тур: {booking.tour.name}</Text>
        <Text>Количество путешественников: {Math.round(booking.total_price / booking.tour.base_price)}</Text>
        <Text>Дата заезда: {new Date(booking.check_in_date).toLocaleDateString("ru-RU")}</Text>
        <Text>Дата выезда: {new Date(booking.check_out_date).toLocaleDateString("ru-RU")}</Text>
        <Text>Общая стоимость: ₽{booking.total_price}</Text>
      </View>
    </Page>
  </Document>
);

const Profile = () => {
  const { user } = useContext(AppContext);
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
        const response = await app.get(`/bookings/`);
        setBookings(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке бронирований:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const totalBookings = bookings.length;
  const totalSpent = bookings.reduce((sum, booking) => sum += parseFloat(booking.total_price), 0);
  const countriesVisited = new Set(bookings.map(booking => booking.tour.city)).size;

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Мои бронирования</h1>
          <p className="mt-1 text-gray-600">Управляйте и отслеживайте свои бронирования туров.</p>
        </div>

        {/* Сводные карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-blue-500/10 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Всего бронирований</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{totalBookings}</p>
            </div>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-green-500/10 p-3 rounded-full">
              <Globe className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Посещенные страны</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{countriesVisited}</p>
            </div>
          </motion.div>
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-purple-500/10 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Всего потрачено</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">₽{totalSpent}</p>
            </div>
          </motion.div>
        </div>

        {/* Список забронированных туров */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {bookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">У вас пока нет забронированных туров.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                >
                  {booking.tour.cover_image && (
                    <img
                      src={booking.tour.cover_image}
                      alt={booking.tour.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {booking.tour.name}
                    </h4>
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{booking.tour.city}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-gray-700 text-sm mb-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{new Date(booking.check_in_date).toLocaleDateString("ru-RU")}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{new Date(booking.check_out_date).toLocaleDateString("ru-RU")}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{Math.round(booking.total_price / booking.tour.base_price)} гостей</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">#{booking.id?.toString().substring(0, 8).toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className="text-lg font-bold text-gray-900 mb-4">
                      ₽{booking.total_price.toLocaleString()}
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                      <button
                        onClick={() => navigate(`/tours/${booking.tour.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        Подробнее
                      </button>
                      <button
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                        disabled
                      >
                        Изменить бронирование
                      </button>
                    </div>

                    <div className="mt-4">
                        <PDFDownloadLink
                          document={<BookingPDF booking={booking} />}
                          fileName={`booking_${booking.id}.pdf`}
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
                        >
                          {({ loading }) => (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              {loading ? "Загрузка счета..." : "Скачать счет"}
                            </>
                          )}
                        </PDFDownloadLink>
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
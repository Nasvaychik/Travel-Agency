import React from "react";
import { useLocation } from "react-router-dom";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20 },
  section: { marginBottom: 10 },
  label: { fontWeight: "bold" },
});

const InvoicePDF = ({ booking }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Счет за бронирование</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Информация о клиенте</Text>
        <Text>Имя: {booking.name}</Text>
        <Text>Email: {booking.email}</Text>
        <Text>Телефон: {booking.phone}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Детали тура</Text>
        <Text>Туры: {booking.tourTitle}</Text>
        <Text>Количество путешественников: {booking.travelers}</Text>
        <Text>Общая стоимость: ₽{booking.totalPrice}</Text>
      </View>
    </Page>
  </Document>
);

const Invoice = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Ошибка: Нет данных о бронировании</h2>
        <p>
          Произошла ошибка при получении информации о вашем бронировании. Пожалуйста, повторите попытку или обратитесь в службу поддержки.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/40 rounded-lg shadow-lg mt-[150px] sm:mt-24 mb-[220px] sm:mb-0">
      <h2 className="text-3xl font-bold mb-6">
        Счет за <span className="text-blue-500">бронирование</span>{" "}
      </h2>
      <div>
        <h3 className="text-2xl font-semibold mb-5">Информация о клиенте</h3>
        <p>
          <strong>Имя:</strong> {booking.name}
        </p>
        <p>
          <strong>Email:</strong> {booking.email}
        </p>
        <p>
          <strong>Телефон:</strong> {booking.phone}
        </p>
      </div>
      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-5">Детали тура</h3>
        <p>
          <strong>Тур:</strong> {booking.tourTitle}
        </p>
        <p>
          <strong>Количество путешественников: </strong>
          {booking.travelers}
        </p>
        <p>
          <strong>Итоговая цена:</strong> ₽{booking.totalPrice}
        </p>
      </div>
      <div className="mt-6">
        {booking ? (
          <PDFDownloadLink
            document={<InvoicePDF booking={booking} />}
            fileName="booking_invoice.pdf"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
                  Загрузка документа...
                </button>
              ) : (
                <button className="px-6 py-3 bg-gradient-to-b from-sky-500 to-blue-500 text-white font-semibold rounded-lg hover:from-sky-800 hover:to-blue-700 transition duration-300 ">
                  Скачать счет-фактуру в формате PDF
                </button>
              )
            }
          </PDFDownloadLink>
        ) : (
          <p>Не удается сгенерировать PDF-файл: отсутствуют данные о бронировании</p>
        )}
      </div>
    </div>
  );
};

export default Invoice;

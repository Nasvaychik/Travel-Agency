import React from "react";
import ServiceCard from "./ServiceCard";
import { Hotel, Plane, Pyramid } from "lucide-react";

const services = [
  {
    icon: <Hotel className="text-blue-500" />,
    title: "Бронирование авиабилетов",
    desc: "С легкостью бронируйте авиабилеты в нужный вам пункт назначения. Наша платформа предлагает конкурентоспособные цены и удобные варианты бронирования.",
  },
  {
    icon: <Plane className="text-blue-500" />,
    title: "Бронирование гостиниц",
    desc: "Найдите и забронируйте лучшие отели в вашем пункте назначения. От бюджетных вариантов размещения до роскошных отелей — у нас есть что-то для каждого путешественника.",
  },
  {
    icon: <Pyramid className="text-blue-500" />,
    title: "Приключенческие туры",
    desc: "Отправляйтесь в захватывающие приключенческие туры по самым интересным и неизведанным местам. Идеально для любителей адреналина и природы.",
  },
];

const ServiceList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((item, index) => (
        <ServiceCard item={item} key={index} />
      ))}
    </div>
  );
};

export default ServiceList;

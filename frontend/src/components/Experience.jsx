import React from "react";
import { TrendingUp, UserCheck, Award } from "lucide-react";
import { motion } from "framer-motion";

const Experience = () => {
  return (
    <motion.div
      className="py-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      viewport={{ once: true }}
    >
      <motion.h1
        className="text-3xl sm:text-4xl font-semibold mb-6 text-center text-gray-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Испытайте наш <span className="text-blue-500">TravelAgency</span>
      </motion.h1>
      <motion.p
        className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Со всем нашим опытом, <br />
        мы предоставим вам самые лучшие услуги.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        <motion.div
          className="flex flex-col items-center bg-white/20 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <TrendingUp className="text-blue-500 mb-4 text-4xl" />
          <span className="text-2xl font-semibold text-gray-800">12 тысяч+</span>
          <h6 className="text-lg text-gray-600">Удачных поездок</h6>
        </motion.div>

        <motion.div
          className="flex flex-col items-center bg-white/20 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <UserCheck className="text-green-500 mb-4 text-4xl" />
          <span className="text-2xl font-semibold text-gray-800">2 тысяч+</span>
          <h6 className="text-lg text-gray-600">Постоянных клиентов</h6>
        </motion.div>

        <motion.div
          className="flex flex-col items-center bg-white/20 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Award className="text-yellow-500 mb-4 text-4xl" />
          <span className="text-2xl font-semibold text-gray-800">10 тысяч+</span>
          <h6 className="text-lg text-gray-600">Проведенных туров</h6>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Experience;

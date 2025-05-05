import React, {useState, useEffect} from "react";
import { motion } from "framer-motion";
import tourData from "../assets/data/tour.js";
import TourCard from "../components/TourCard.jsx";
import axios from "axios";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const TourList = () => {

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tours/');
        setTours(response.data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tours.map((tour, index) => (
        <motion.div
          key={index}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.2 }}
        >
          <TourCard tour={tour} />
        </motion.div>
      ))}
    </div>
  );
};

export default TourList;

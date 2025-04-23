import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="flex items-center justify-between gap-4 py-3 mt-auto">
      <img src="/logo.png" width={60} alt="logo" className="mb-2" />
      <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden">
        &copy; 2024 TravelAgency. Все права защищены. | Работает на основе инноваций.
      </p>
    </footer>
  );
};

export default Footer;

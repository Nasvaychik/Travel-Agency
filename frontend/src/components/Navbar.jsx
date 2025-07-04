import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";

const Navbar = () => {
  const { user, logout } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="w-full flex justify-between items-center py-2 px-2 sm:p-6 sm:px-20 top-0 sticky z-50">
      <Link to="/">
        <img
          src="/logo.png"
          className="w-[40px] sm:w-[80px] md:w-[100px]"
          alt="logo"
        />
      </Link>

      {/* Гибкий контейнер для небольших экранов */}
      <div className="flex items-center gap-4 sm:hidden">
        {user && (
          <Link to="/profile" className="relative group">
            <img
              src={assets.user}
              alt="profileimg"
              className="w-10 drop-shadow"
            />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-12 p-2 bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {user.first_name} {user.last_name}
            </div>
          </Link>
        )}

        <button onClick={toggleMenu} className="text-2xl">
          {menuOpen ? (
            <X className="text-black" />
          ) : (
            <Menu className="text-black" />
          )}
        </button>
      </div>

      {/*Меню для десктопа */}
      <div className="hidden sm:flex items-center gap-6">
        <ul className="flex gap-6">
          <li>
            <Link
              to="/"
              className={`hover:text-blue-500 ${
                location.pathname === "/" ? "text-blue-500 font-bold" : ""
              }`}
            >
              Главная
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`hover:text-blue-500 ${
                location.pathname === "/about" ? "text-blue-500 font-bold" : ""
              }`}
            >
              О нас
            </Link>
          </li>
          <li>
            <Link
              to="/tours"
              className={`hover:text-blue-500 ${
                location.pathname === "/tours" ? "text-blue-500 font-bold" : ""
              }`}
            >
              Туры
            </Link>
          </li>
        </ul>
        {user ? (
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Link to="/profile">
                <img src={assets.user} alt="profile" width={40} className="cursor-pointer" />
                {/* Всплывающая подсказка по имени пользователя */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-12 p-2 bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Привет, {user.first_name}
                </div>
              </Link>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gradient-to-b from-sky-500 to-blue-500 text-white rounded hover:from-sky-800 hover:to-blue-700"
            >
              Выход
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="px-4 py-2 bg-gradient-to-b from-sky-500 to-blue-500 text-white rounded hover:from-sky-800 hover:to-blue-700">
              Авторизоваться
            </button>
          </Link>
        )}
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div className="sm:hidden absolute top-16 left-0 w-full bg-sky-100/90 p-4">
          <ul className="flex flex-col items-center gap-4">
            <li>
              <Link
                to="/"
                className={`hover:text-blue-500 ${
                  location.pathname === "/" ? "text-blue-500 font-bold" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Главная
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`hover:text-blue-500 ${
                  location.pathname === "/about" ? "text-blue-500 font-bold" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                О нас
              </Link>
            </li>
            <li>
              <Link
                to="/tours"
                className={`hover:text-blue-500 ${
                  location.pathname === "/tours" ? "text-blue-500 font-bold" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Туры
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link
                    to="/profile"
                    className={`hover:text-blue-500 ${
                      location.pathname === "/profile" ? "text-blue-500 font-bold" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Личный кабинет
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-b from-sky-500 to-blue-500 text-white rounded hover:from-sky-800 hover:to-blue-700"
                  >
                    Выход
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;

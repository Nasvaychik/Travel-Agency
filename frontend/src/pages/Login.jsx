import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Navigate, useNavigate } from "react-router-dom"; // Импортировать usenavigate
import { app } from "../app";

const LoginPage = () => {
  const token = localStorage.getItem('token');
  const { setToken, setUser } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate(); // Инициализация навигации

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (!email || !password || (isLogin ? false : !name)) {
        toast.error("Все поля обязательны для заполнения!");
        return;
      }

      let response;
      const [last_name, first_name, surname] = name.split(" ").slice(0, 3);

      // Определите, нужно ли вам войти в систему или зарегистрироваться
      if (isLogin) {
        response = await app.post(`/users/token`, {
          email,
          password,
        });
      } else {
        response = await app.post(`/users/register`, {
          last_name,
          first_name,
          surname,
          email,
          password,
        });
      }

      // Проверка, получен ли ответ успешно
      if (response.status === 200) {
        const { access_token, user } = response.data;
        setToken(access_token);
        setUser(user);

        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        // Показывать всплывающее сообщение об успехе
        toast.success(
          isLogin ? "Успешно вошел в систему!" : "Зарегистрировался успешно!"
        );

        // Перенаправление на домашнюю страницу после успешного входа в систему или регистрации
        navigate("/"); 
      } else {
        toast.error(response.data.message || "Что-то пошло не так!");
      }
    } catch (error) {
      console.error(error); // Запись ошибки в журнал на консоль
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (token) {
    return <Navigate to="/" />
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-[-70px] text-center mb-10">
        Добро пожаловать в <span className="text-blue-500">TravelAgency</span>
      </h1>
      <div className="bg-white/20 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-black">
          {isLogin ? "Логин" : "Регистрация"}
        </h2>
        <form onSubmit={onSubmitHandler} className="space-y-4 mt-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-md font-medium">
                Полное имя
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите свое полное имя"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-md font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите свой email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-md font-medium">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите свой пароль"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLogin ? "Логин" : "Регистрация"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            {isLogin ? (
              <>
                У вас нет учетной записи?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setIsLogin(false)}
                >
                  Зарегистрируйтесь здесь
                </span>
              </>
            ) : (
              <>
                У вас уже есть учетная запись?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setIsLogin(true)}
                >
                  Войдите в систему здесь
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

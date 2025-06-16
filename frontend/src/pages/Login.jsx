import { useState, useContext, useMemo } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { Navigate, useSearchParams } from "react-router-dom"; // Импортировать usenavigate
import { app } from "../app";

const LoginPage = () => {
  const token = localStorage.getItem("token");
  const [params] = useSearchParams();
  const { setToken, setUser } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const fallbackUrl = useMemo(() => {
    return params.get("next");
  }, [params]);

  const handleSubmitRegistrion = (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("Все поля обязательны для заполнения!");
      return;
    }

    const [last_name, first_name, surname] = name.split(" ").slice(0, 3);
    app
      .post(`/users/register`, {
        last_name,
        first_name,
        surname,
        email,
        password,
      })
      .then(() => {
        toast.success("Успешная регистрация!");
        handleSubmitLogin(e);
      })
      .catch((error) => toast.error(error.response.message));
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Все поля обязательны для заполнения!");
      return;
    }

    app
      .post(`/users/token`, {
        email,
        password,
      })
      .then((response) => {
        const { access_token, user } = response.data;
        setToken(access_token);
        setUser(user);

        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success(`Успешно вошел в систему, ${user.first_name}!`);
      })
      .catch((error) => toast.error(error.response.message));
  };


  if (token) {
    return <Navigate to={fallbackUrl ? fallbackUrl : '/'} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-[-70px] text-center mb-10">
        Добро пожаловать в <span className="text-blue-500">TravelAgency</span>
      </h1>
      <div className="bg-white/20 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-black">
          {isLogin ? "Логин" : "Регистрация"}
        </h2>
        <form
          onSubmit={isLogin ? handleSubmitLogin : handleSubmitRegistrion}
          className="space-y-4 mt-6"
        >
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

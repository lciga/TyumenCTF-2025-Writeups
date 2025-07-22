import { useCallback, useRef, useState } from "react";
import { registerUser } from "../api";
import { Link } from "react-router";

type RegisterState = "register" | "show-2fa";

export function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [twoFactorQr, setTwoFactorQr] = useState("");
  const [state, setState] = useState<RegisterState>("register");
  const [error, setError] = useState<undefined | string>();
  const isBusy = useRef(false);

  const register = useCallback(() => {
    if (!username) {
      setError("Введите имя пользователя.");
      return;
    }

    if (!password) {
      setError("Введите пароль.");
      return;
    }

    if (password !== repeatPassword) {
      setError("Пароли не совпадают.");
      return;
    }

    if (!isBusy.current) {
      isBusy.current = true;

      registerUser(username, password).then(([status, response]) => {
        isBusy.current = false;

        if (response && typeof response === "object" && "Ok" in response) {
          setState("show-2fa");
          setTwoFactorQr(response.Ok.two_factor_qr);
          setUsername(username);
        } else if (status === 409) {
          setError("Пользователь с таким именем уже существует.");
        }
      });
    }
  }, [username, password, repeatPassword]);

  return (
    <div className="flex flex-row justify-center">
      <div className="border-green-800 border-2 p-3 min-w-[380px]">
        {state === "register" && (
          <>
            <h2 className="block text-center mb-2 text-lg">Регистрация</h2>

            <input
              className="block mb-2 w-full border-green-300 border-2"
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="block mb-2 w-full border-green-300 border-2"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="block mb-2 w-full border-green-300 border-2"
              type="password"
              placeholder="Повтор пароля"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />

            <div className="text-right">
              <button className="bg-green-300 p-1" onClick={register}>
                Продолжить
              </button>
            </div>
          </>
        )}

        {state === "show-2fa" && (
          <>
            <h2 className="block text-center mb-2 text-lg">
              Добро пожаловать, {username}!
            </h2>

            <p>Пожалуйста, добавьте код двухфакторной аутентификации</p>

            <img className="w-full" src={twoFactorQr} />

            <div className="text-right">
              <Link to="/login">
                <button className="bg-green-300 p-1">Войти</button>
              </Link>
            </div>
          </>
        )}

        <div className="w-full text-center text-red-600">{error}</div>
      </div>
    </div>
  );
}

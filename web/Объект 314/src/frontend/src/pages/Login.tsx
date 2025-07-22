import { useCallback, useContext, useRef, useState } from "react";
import { getUserProfile, loginUser } from "../api";
import { useNavigate } from "react-router";
import { UserContext } from "../context/user";

type LoginState = "username" | "password" | "2fa";

export function Login() {
  const [state, setState] = useState<LoginState>("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const isBusy = useRef(false);
  const navigate = useNavigate();
  const { setRefreshTrigger: setLogoutTrigger } = useContext(UserContext);

  const enterUsername = useCallback(() => {
    if (username && !isBusy.current) {
      isBusy.current = true;

      getUserProfile(username).then(([_, profile]) => {
        isBusy.current = false;

        if (profile?.username) {
          setState("password");
          setUsername(username);
          setError(undefined);
        } else {
          setError("Пользователь не найден");
        }
      });
    }
  }, [username, isBusy, setUsername, setError, setState]);

  const processLoginResponse = useCallback(
    ([_status, response]: Awaited<ReturnType<typeof loginUser>>) => {
      console.log(response);

      if (response === "Ok") {
        navigate("/");
        setLogoutTrigger(Math.random());
      } else if (response === "InvalidCredentials") {
        setError("Неверный пароль.");
      } else if (response === "TwoFactorRequired") {
        setState("2fa");
        setError(undefined);
      } else if (response === "InvalidTwoFactor") {
        setError("Неверный код двухфакторной аутентификации.");
      }
    },
    [setState, setError, navigate]
  );

  const enterPassword = useCallback(() => {
    if (username && password && !isBusy.current) {
      isBusy.current = true;

      loginUser(username, password).then((kek) => {
        isBusy.current = false;

        processLoginResponse(kek);
      });
    }
  }, [username, password, isBusy, processLoginResponse]);

  const enterTwoFactor = useCallback(() => {
    if (username && password && twoFactorCode && !isBusy.current) {
      isBusy.current = true;

      loginUser(username, password, twoFactorCode).then((kek) => {
        isBusy.current = false;

        processLoginResponse(kek);
      });
    }
  }, [username, password, twoFactorCode, isBusy, processLoginResponse]);

  return (
    <div className="flex flex-row justify-center">
      <div className="border-green-800 border-2 p-3 min-w-[380px]">
        {state === "username" && (
          <>
            <h2 className="block text-center mb-2 text-lg">Вход</h2>
            <input
              className="block mb-2 w-full border-green-300 border-2"
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="text-right">
              <button className="bg-green-300 p-1" onClick={enterUsername}>
                Продолжить
              </button>
            </div>
          </>
        )}

        {state === "password" && (
          <>
            <h2 className="block text-center mb-2 text-lg">
              Добро пожаловать, {username}
            </h2>
            <input
              className="block mb-2 w-full border-green-300 border-2"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-right">
              <button className="bg-green-300 p-1" onClick={enterPassword}>
                Продолжить
              </button>
            </div>
          </>
        )}

        {state === "2fa" && (
          <>
            <h2 className="block text-center mb-2 text-lg">
              Добро пожаловать, {username}
            </h2>
            <input
              className="block mb-2 w-full border-green-300 border-2"
              type="text"
              placeholder="Код двухфакторной аутентификации"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
            />
            <div className="text-right">
              <button className="bg-green-300 p-1" onClick={enterTwoFactor}>
                Войти
              </button>
            </div>
          </>
        )}

        <div className="w-full text-center text-red-600">{error}</div>
      </div>
    </div>
  );
}

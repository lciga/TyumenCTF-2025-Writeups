import { useCallback, useContext, useEffect, useState } from "react";
import { getMe, logoutUser } from "../api";
import { Link } from "react-router";
import { UserContext } from "../context/user";

export function AccountPanel(props: { className?: string }) {
  const { setRefreshTrigger, user } = useContext(UserContext);

  // useEffect(() => {
  //   getMe().then(([_, me]) => setUsername(me?.username));
  // }, [logoutTrigger]);

  const logout = useCallback(() => {
    logoutUser().then(() => {
      setRefreshTrigger(Math.random());
    });
  }, [setRefreshTrigger]);

  return (
    <div className={props.className}>
      {user?.username !== null &&
        (user?.username ? (
          <>
            <div>Рады видеть, {user?.username}</div>
            <div>
              <a className="text-green-900 underline" href="#" onClick={logout}>
                Выйти
              </a>
            </div>
          </>
        ) : (
          <>
            <div>Вы не вошли</div>
            <div>
              <Link className="text-green-900 underline mr-3" to="/login">
                Войти
              </Link>
              <Link className="text-green-900 underline" to="/register">
                Зарегистрироваться
              </Link>
            </div>
          </>
        ))}
    </div>
  );
}

import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./layout/Layout";
import { Index } from "./pages/Index";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { UserContext, UserData } from "./context/user";
import { useEffect, useState } from "react";
import { getMe } from "./api";
import { VT100 } from "./pages/VT100";

export function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState<UserData | undefined>();

  useEffect(() => {
    getMe().then(([_, me]) => {
      if (me) {
        setUser({
          username: me.username,
          isAdmin: me.is_admin,
        });
      } else {
        setUser(undefined);
      }
    });
  }, [refreshTrigger, setUser]);

  return (
    <UserContext.Provider
      value={{
        refreshTrigger,
        setRefreshTrigger,
        user,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route
            path="/classified/secure-connection-vt100"
            element={<VT100 />}
          />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

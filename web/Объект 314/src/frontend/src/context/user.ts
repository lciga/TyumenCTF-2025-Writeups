import React from "react";

export type UserData = {
  username: string;
  isAdmin: boolean;
};

export const UserContext = React.createContext<{
  refreshTrigger: number;
  setRefreshTrigger: (trigger: number) => void;

  user?: UserData;
}>({ refreshTrigger: 0, setRefreshTrigger: () => {} });

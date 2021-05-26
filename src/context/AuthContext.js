import { createContext, useState, useContext, useEffect } from "react";
import firebase from "../firebase/firebase";

const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Auth.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </Auth.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(Auth);
};

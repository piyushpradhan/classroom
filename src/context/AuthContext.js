import { createContext, useReducer, useContext, useEffect } from "react";
import AuthReducer from "../reducers/AuthReducer";

import cookie from "js-cookie";
import firebase from "../firebase/firebase";

const Auth = createContext();

const tokenName = "firebaseToken";

export const AuthProvider = ({ children }) => {
  const initialState = {
    user: null,
  };
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const emailLogin = async (email, password, redirectPath) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("user logged in ");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Auth.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </Auth.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(Auth);
};

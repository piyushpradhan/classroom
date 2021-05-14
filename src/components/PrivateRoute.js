import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useAuthContext } from "../context/AuthContext";
import firebase from '../firebase/firebase'; 

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuthContext();
  console.log(firebase.auth().isAuthenticated); 

  return (
    <Route
      {...rest}
      render={(props) => {
        firebase.auth().isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    ></Route>
  );
}

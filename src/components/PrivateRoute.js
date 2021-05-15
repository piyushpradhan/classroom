import React from "react";
import { Route, Redirect } from "react-router-dom";

import firebase from "../firebase/firebase"; 

export default function PrivateRoute({ component: Component, ...rest }) {

  console.log(firebase.auth().isAuthenticated);
  return (
    <Route
      {...rest}
      render = {props => {
        firebase.auth().isAuthenticated ? <Component {...props} /> : <Redirect to="/"/>
      }}
    ></Route>
  );
}

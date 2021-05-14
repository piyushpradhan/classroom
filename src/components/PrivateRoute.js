import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useAuthContext } from "../context/AuthContext";

export default function PrivateRoute({ component: Component, ...rest }) {
  const {
    state: { user },
  } = useAuthContext();

  console.log(user);

  return (
    <Route
      {...rest}
      render={(props) => {
        user ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    ></Route>
  );
}

import React from "react";
import { Redirect, Route, useLocation } from "react-router-dom";
import { isAuth } from "./helper";

const PrivateRoute = ({ component, ...rest }: any) => {
  const location = useLocation();

  const routeComponent = (props: any) =>
    isAuth() ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{ pathname: "/signin", state: { from: location } }} />
    );
  return <Route {...rest} render={routeComponent} />;
};

export default PrivateRoute;

import React, { FC, Fragment } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { isAuth, signout } from "../auth/helper";
import "./../default.css";

const Layout: FC = (props) => {
  const history = useHistory();

  const nav = () => (
    <ul className="nav nav-tabs bg-primary">
      <NavLink to="/" exact className="text-light nav-link">
        Home
      </NavLink>

      {!isAuth() && (
        <>
          <NavLink to="/signin" className="text-light nav-link">
            Signin
          </NavLink>

          <NavLink to="/signup" className="text-light nav-link">
            SignUp
          </NavLink>
        </>
      )}
      {isAuth() && isAuth().role === "admin" && (
        <NavLink className="nav-link text-light" to="/admin">
          {isAuth().name}
        </NavLink>
      )}

      {isAuth() && isAuth().role === "subscriber" && (
        <NavLink className="nav-link text-light" to="/private">
          {isAuth().name}
        </NavLink>
      )}

      {isAuth() && (
        <li
          className="nav-link text-danger font-weight-bold"
          style={{ cursor: "pointer" }}
          onClick={() => {
            signout(() => {
              history.push("/");
            });
          }}
        >
          Signout
        </li>
      )}
    </ul>
  );

  return (
    <Fragment>
      {nav()}
      <div className="container">{props.children}</div>
    </Fragment>
  );
};

export default Layout;

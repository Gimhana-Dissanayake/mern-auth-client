import axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Layout from "../core/Layout";
import { authenicate, isAuth } from "./helper";
import jwt from "jsonwebtoken";

const Reset = () => {
  const history = useHistory();

  const params = useParams() as { token: string };

  const [values, setValues] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Request password reset link",
  });

  useEffect(() => {
    let token = params.token;
    let { name } = jwt.decode(token) as { name: string };
    if (token) {
      setValues((pS) => {
        return {
          ...pS,
          name,
          token,
        };
      });
    }
  }, []);

  const { name, token, newPassword, buttonText } = values;

  const handleChange = (event: any) => {
    setValues({ ...values, newPassword: event.target.value });
  };

  const clickSubmit = (event: any) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: { newPassword, resetPasswordLink: token },
    })
      .then((response) => {
        console.log("RESET_PASSWORD_SUCCESS ", response);
        //save the response (user, token) localstorage/cookie
        toast.success(response.data.message);
        setValues({ ...values, buttonText: "Done" });
      })
      .catch((error) => {
        console.log("FORGOT_PASSWORD_ERROR ", error.response.data);
        toast.error(error.response.data.error);
        setValues({ ...values, buttonText: "Reset password" });
      });
  };

  // console.log("state ", values)

  const resetPasswordForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange}
          value={newPassword}
          type="password"
          className="form-control"
          placeholder="Type new password"
          required
        />
      </div>
      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />

        <h1 className="p-5 text-center">Hey {name}, type your new password</h1>
        {resetPasswordForm()}
      </div>
    </Layout>
  );
};

export default Reset;

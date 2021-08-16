import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { getCookie, isAuth, signout, updateUser } from "../auth/helper";

import Layout from "../core/Layout";

const Admin = () => {
  const [values, setValues] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { push } = useHistory();
  const token = getCookie("token");

  const loadProfile = useCallback(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("ADMIN PROFILE UPDATE ", response);
        const { role, name, email } = response.data;

        setValues((pS: any) => {
          return { ...pS, role, name, email };
        });
      })
      .catch((err) => {
        console.log("ADMIN PROFILE UPDATE ERROR ", err.response.data.error);
        if (err.response.status === 401) {
          signout(() => {
            push("/");
          });
        }
      });
  }, [push, token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const { role, name, email, password, buttonText } = values;

  const handleChange = (name: string) => (event: any) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event: any) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/admin/update`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { name, password },
    })
      .then((response) => {
        console.log("PRIVATE_PROFILE_UPDATE_SUCCESS ", response);

        updateUser(response, () => {
          setValues({
            ...values,
            buttonText: "Submitted",
          });
        });
        toast.success("Profile updated successfully");
      })
      .catch((error) => {
        console.log("PRIVATE_PROFILE_UPDATE_ERROR ", error.response.data.error);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  // console.log("state ", values)

  const updateForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Role</label>
        <input
          defaultValue={role}
          type="text"
          className="form-control"
          disabled
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          defaultValue={email}
          type="text"
          className="form-control"
          disabled
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          value={password}
          type="password"
          className="form-control"
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
        <h1 className="pt-5 text-center">Admin</h1>
        <p className="lead text-center">Profile update</p>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Admin;

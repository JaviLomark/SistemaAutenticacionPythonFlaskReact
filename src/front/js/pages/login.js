import React from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export const Login = () => {
  const navigate = useNavigate();
  const onLogin = async () => {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;

    const body = JSON.stringify({ email, password });
    const res = await fetch(`${config.HOSTNAME}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await res.json();
    if (res.status == 200) {
      const token = data.data;
      localStorage.token = JSON.stringify({ token });
    }
    navigate("/private");
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <div className="mb-3">
        <label htmlFor="email-input" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email-input"
          placeholder="name@example.com"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password-input" className="form-label">
          Password
        </label>
        <input type="password" className="form-control" id="password-input" />
      </div>
      <button type="button" className="btn btn-primary" onClick={onLogin}>
        Submit
      </button>
    </div>
  );
};

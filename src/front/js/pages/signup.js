import React from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export const Signup = () => {
  const navigate = useNavigate();
  const onSignup = async () => {
    const email = document.getElementById("email-input").value;
    const passwordNew = document.getElementById("password-input").value;
    const passwordRepeat = document.getElementById(
      "password-input-repeat"
    ).value;

    if ((email == 0) & (passwordNew == 0) & (passwordRepeat == 0)) {
      alert("Por favor, rellena los campos");
      return;
    }

    if (email.length == 0) {
      alert("Por favor, introduce un correo");
      return;
    }

    if ((passwordNew == 0) & (passwordRepeat == 0)) {
      alert("Por favor, crea una contraseña");
      return;
    }

    if (passwordNew.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (passwordNew !== passwordRepeat) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const body = JSON.stringify({
      email,
      passwordNew,
      passwordRepeat,
    });

    const res = await fetch(`${config.HOSTNAME}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await res.json();
    if (res.status != 201) {
      alert(data.msg);
      return;
    }
    navigate("/login");
  };

  return (
    <div className="container">
      <h1>Signup</h1>
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
      <div className="mb-3">
        <label htmlFor="password-input-repeat" className="form-label">
          Repeat Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password-input-repeat"
        />
      </div>
      <button type="button" className="btn btn-primary" onClick={onSignup}>
        Submit
      </button>
    </div>
  );
};

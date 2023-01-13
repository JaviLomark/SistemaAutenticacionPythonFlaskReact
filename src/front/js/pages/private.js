import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export const Private = () => {
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenOBJ = localStorage.token;
    if (!tokenOBJ) {
      navigate("/login");
    }
    const tokenData = JSON.parse(tokenOBJ);

    fetch(`${config.HOSTNAME}/api/private`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then(() => {
        setDisabled(false);
      });
  }, [disabled]);

  if (disabled) {
    return <h1>Cargando...</h1>;
  }

  return <h1>Has accedido al contenido privado</h1>;
};

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [usuarioLogin, setUsuarioLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_login: usuarioLogin, contrasena: password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Credenciales incorrectas");
        return;
      }

      const data = await response.json();
      console.log(data); // Por ejemplo: { message: 'Login exitoso', usuario: { id: 1, rol: 'admin' } }
      navigate("/panel");

    } catch (error) {
      setError("Error en el servidor. Intenta más tarde.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Iniciar Sesión</h2>

        <input
          type="text"
          placeholder="Usuario"
          value={usuarioLogin}
          onChange={(e) => setUsuarioLogin(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
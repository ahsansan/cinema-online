// useState
import { useState } from "react";
// Register
import Register from "./Register";
// Login
import Login from "./Login";
// Custom Css
import "../../styles/header.css";

export default () => {
  // login
  const [isOpenLogin, setOpenLogin] = useState(false);
  const handleLogin = (datanya) => setOpenLogin(datanya);

  // register
  const [isOpenRegister, setOpenRegister] = useState(false);
  const handleRegister = (datanya) => setOpenRegister(datanya);

  return (
    <div className="auth-button">
      <div>
        <p>
          <button
            className="login-auth-button"
            onClick={() => handleLogin(true)}
          >
            Login
          </button>{" "}
          <button
            className="register-auth-button"
            onClick={() => handleRegister(true)}
          >
            Register
          </button>
        </p>
        {isOpenLogin && (
          <Login
            isOpen={isOpenLogin}
            isClose={() => handleLogin(false)}
            isOpenRegister={() => handleRegister(true)}
          />
        )}
        {isOpenRegister && (
          <Register
            isOpen={isOpenRegister}
            isClose={() => handleRegister(false)}
            isOpenLogin={() => handleLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

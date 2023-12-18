import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../../App.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        setError("Incorrect email or password. Please try again.");
      });
  };

  return (
    <div className="auth-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <header>Login</header>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={email}
          placeholder="email@gmail.com"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type={passwordShown ? "text" : "password"}
          value={password}
          placeholder="*********"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
        <a
          href="#"
          className="register-link"
          onClick={() => navigate("/register")}
        >
          Don't have an account?
        </a>
      </form>
    </div>
  );
};

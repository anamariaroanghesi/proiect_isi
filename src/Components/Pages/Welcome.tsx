import React from "react";
import { Link } from "react-router-dom";
import "./Welcome.css";

const WelcomePage: React.FC<{ userName: string }> = ({ userName }) => {
  return (
    <div className="welcome-page">
      <h1>Welcome, {userName}!</h1>
      <p>Manage your hotel and reservations with ease.</p>
    </div>
  );
};

export default WelcomePage;

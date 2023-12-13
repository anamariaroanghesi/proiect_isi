import { Login } from "./Components/Login/Login";
import React, { useContext, useState } from "react";
import { Register } from "./Components/Login/Register";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [userId, setUserId] = useState<string | null>(null);

  const toggleForm = (formName: string) => {
    setCurrentForm(formName);
  };

  const handleUserIdChange = (userId: string | null) => {
    setUserId(userId); // Update the user ID state
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

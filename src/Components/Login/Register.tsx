import React, { useState } from "react";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../../App.css";

// interface Props {
//   onFormSwitch: (formType: string) => void;
// }

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerification, setPasswordVerification] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError2(false);
    setError(false);
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      passwordVerification === "" ||
      phoneNumber === ""
    ) {
      setError2(true);
      return;
    }
    if (password !== passwordVerification) {
      setError(true);
      return;
    }

    try {
      // Register the user using Firebase Authentication
      const authResult = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = authResult.user;

      // Generate a unique ID for the user profile
      const managerId = user.uid;

      // Create the user profile object
      const managerData = {
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
      };

      // Save the manager to the "managers" collection in Firestore
      const managersCollection = collection(db, "managers");
      const managerDocRef = doc(managersCollection, managerId);
      await setDoc(managerDocRef, managerData);

      console.log("User registration and profile saved successfully");
      // Redirect to another page or perform any other actions upon successful registration
      // navigate("/home");
    } catch (error) {
      console.log("Error registering user:", error);
      // Handle registration error, display error message, etc.
    }
  };

  return (
    <div className="auth-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <header>Register</header>
        <label htmlFor="name">Full name</label>
        <input
          type="text"
          value={name}
          placeholder="Full name"
          id="name"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={email}
          placeholder="email@gmail.com"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="phone">Phone number</label>
        <input
          type="tel"
          value={phoneNumber}
          placeholder="0712 345 678"
          id="phone"
          name="phone"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          placeholder="*********"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="password-verification">Verify Password</label>
        <input
          type="password"
          value={passwordVerification}
          placeholder="*********"
          id="password-verification"
          name="password-verification"
          onChange={(e) => setPasswordVerification(e.target.value)}
        />
        {error2 && (
          <div className="alert alert-danger">All fields need to be filled</div>
        )}
        {error && (
          <div className="alert alert-danger">Passwords do not match</div>
        )}
        <button type="submit">Register</button>
        <a
          href="#"
          className="register-link"
          onClick={() => navigate("/login")}
        >
          Already have an account?
        </a>
      </form>
    </div>
  );
};

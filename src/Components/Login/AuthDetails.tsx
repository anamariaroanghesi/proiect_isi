import { onAuthStateChanged, signOut, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./AuthDetails.css";
import { Button } from "@mui/material";

const AuthDetails: React.FC = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="auth-details-container">
      {authUser ? (
        <>
          <p className="auth-user-email">{`Signed In as ${authUser.email}`}</p>
          <Button
            variant="contained"
            color="secondary"
            onClick={userSignOut}
            sx={{ margin: "16px", backgroundColor: "pink" }}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <p className="signed-out-text">Signed Out</p>
      )}
    </div>
  );
};

export default AuthDetails;

import { useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import {
  EmailAuthProvider,
  PhoneAuthCredential,
  PhoneAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updatePhoneNumber,
} from "firebase/auth";
import { Box, Card } from "@mui/material";
import { Row, Col, Divider } from "antd";

interface PersonalDetailsProps {
  userId: string;
}

interface UserData {
  name: string;
  email: string;
  phoneNumber: string;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ userId }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error2, setError2] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not found.");
      }

      const phoneCredential = PhoneAuthProvider.credential(
        user.phoneNumber || "", // Existing phone number (or empty string if null)
        password // Reauthentication with current password
      ) as PhoneAuthCredential;

      await reauthenticateWithCredential(user, phoneCredential);

      await updatePhoneNumber(user, phoneCredential);

      // Phone number updated successfully
      console.log("Phone number updated successfully.");
    } catch (error2) {
      setError2("Error changing phone number. Please try again.");
      console.log("Error changing phone number:", error2);
    }
  };

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        if (user.email) {
          const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
          );
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, newPassword);

          console.log("Password updated successfully!");
          setCurrentPassword("");
          setNewPassword("");
          setError("");
        } else {
          setError("User email not found.");
        }
      }
    } catch (error) {
      setError(
        "Failed to update password. Please check your current password."
      );
      console.log("Error updating password:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(collection(db, "managers"), userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as UserData;
          setUserData(userData);
        } else {
          console.log("User document does not exist");
        }
      } catch (error) {
        console.log("Error retrieving user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div>
      <>
        <Divider orientation="left"></Divider>
        <p></p>
        <div className="personal-details">
          <h2
            style={{
              fontSize: "50px",
              marginBottom: "20px",
            }}
          >
            Personal Details
          </h2>
          {userData && (
            <div style={{ fontSize: "20px", marginBottom: "10px" }}>
              <p style={{ marginBottom: "5px" }}>
                <strong>Name:</strong> {userData.name}
              </p>
              <p></p>
              <p style={{ marginBottom: "5px" }}>
                <strong>Email:</strong> {userData.email}
              </p>
              <p></p>
              <p style={{ marginBottom: "5px" }}>
                <strong>Phone Number:</strong> {userData.phoneNumber}
              </p>
            </div>
          )}
        </div>

        <Divider orientation="left"></Divider>

        <Row align="top">
          <Col span={7}>
            <div className="change-password">
              <h2>Change Password</h2>
              <div>
                <label>
                  Current Password:
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  New Password:
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>
              </div>
              <p></p>
              <button className="accept-button" onClick={handleChangePassword}>
                Change Password
              </button>
              {error && <p>{error}</p>}
            </div>
          </Col>
          <Col span={3}></Col>
          <Col span={7}>
            <div>
              <h2>Change Phone Number</h2>
              {error && <p className="error-message">{error}</p>}
              <form onSubmit={handleSubmit}>
                <label htmlFor="phoneNumber">New Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <label htmlFor="password">Current Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p></p>
                <button className="accept-button">Change Phone Number</button>
              </form>
            </div>
          </Col>
        </Row>
        <Divider orientation="left"></Divider>
      </>
    </div>
  );
};

export default PersonalDetails;

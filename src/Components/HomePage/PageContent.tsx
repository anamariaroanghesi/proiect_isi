import Hotels from "../Pages/Hotels";
import PendingReservations from "../Pages/PendingReservations";
import Profile from "../Pages/Profile";
import AcceptedReservations from "../Pages/AcceptedReservations";
import HotelDetails from "../Pages/HotelDetails";
import AddHotel from "../Pages/AddHotel";
import AddRoom from "../Pages/AddRoom";
import History from "../Pages/History";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import WelcomePage from "../Pages/Welcome";
import { Route, Routes, useParams } from "react-router-dom";
import Rooms from "../Pages/Rooms";
// import { RoomPreferences } from "@mui/icons-material";
import RoomsHotels from "../Pages/RoomsHotels";
import HotelsMap from "../Pages/HotelsMap";

function PageContent() {
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email } = user;
        setUserId(uid);
        setUserEmail(email || "");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="PageContent">
      <Routes>
        <Route
          path="/"
          element={<WelcomePage userName={userEmail.split("@")[0]} />}
        />
        <Route path="/acc_details" element={<Profile userId={userId} />} />
        <Route
          path="/hotel_details/:hotelId"
          element={<HotelDetailsWrapper />}
        />
        <Route path="/add_hotel" element={<AddHotel />} />
        <Route path="/add_room" element={<AddRoom />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:hotelId" element={<RoomsWrapper />} />
        <Route path="/pending_reservations" element={<PendingReservations />} />
        <Route
          path="/accepted_reservations"
          element={<AcceptedReservations />}
        />
        <Route path="/history" element={<History />} />
        <Route path="/map" element={<HotelsMap />} />
      </Routes>
    </div>
  );
}

const HotelDetailsWrapper: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();

  if (!hotelId) {
    return <div>Invalid hotel ID</div>;
  }

  return <HotelDetails hotelId={hotelId} />;
};

const RoomsWrapper: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();

  if (!hotelId) {
    return <div>Invalid hotel ID</div>;
  }
  return <RoomsHotels hotelId={hotelId} />;
};
export default PageContent;

import { useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Carousel, Button, Divider } from "antd";
import { Link } from "react-router-dom";

interface HotelDetailsProps {
  hotelId: string;
}

interface HotelData {
  image: string;
  image2: string;
  location: string;
  name: string;
  rooms: number;
  id_hotel: number;
  rating: number;
}

const contentStyle: React.CSSProperties = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const HotelDetails: React.FC<HotelDetailsProps> = ({ hotelId }) => {
  const [hotelData, setHotelData] = useState<HotelData | null>(null);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const hotelRef = doc(collection(db, "hotels"), hotelId);
        const hotelSnapshot = await getDoc(hotelRef);

        if (hotelSnapshot.exists()) {
          const hotelData = hotelSnapshot.data() as HotelData;
          setHotelData(hotelData);
        } else {
          console.log("Hotel document does not exist");
        }
      } catch (error) {
        console.log("Error retrieving hotel data:", error);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  return (
    <div>
      <Divider orientation="left"></Divider>
      <div style={{ display: "flex" }}>
        {hotelData ? (
          <div>
            <img
              src={hotelData.image2}
              alt="Hotel"
              style={{ maxWidth: "100%", marginRight: "20px" }}
            />
          </div>
        ) : (
          <p>Loading hotel details...</p>
        )}
        {hotelData && (
          <div>
            <h1>{hotelData.name}</h1>
            <p>
              <strong>Location:</strong> {hotelData.location}
            </p>
            <p>
              <strong>Rooms:</strong> {hotelData.rooms}
            </p>
            <p>
              <strong>Rating:</strong> {hotelData.rating}/5
            </p>
            <Button type="primary" style={{ marginTop: "20px" }}>
              <Link to={`/home/rooms/${hotelData.name}`}>View Rooms</Link>
            </Button>
          </div>
        )}
      </div>
      <Divider orientation="left"></Divider>
    </div>
  );
};

export default HotelDetails;

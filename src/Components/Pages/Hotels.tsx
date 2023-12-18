import { Avatar, List, Space, Typography } from "antd";
import { Link } from "react-router-dom";
const { Title } = Typography;

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";

interface Hotel {
  id_hotel: string;
  location: string;
  name: string;
  image: string;
  image2: string;
  rooms: number;
}

const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const hotelsCollectionRef = collection(db, "hotels");
      const snapshot = await getDocs(hotelsCollectionRef);

      const fetchedHotels: Hotel[] = [];
      snapshot.forEach((doc) => {
        const hotelData = doc.data();
        const hotel: Hotel = {
          id_hotel: doc.id,
          location: hotelData.location,
          name: hotelData.name,
          image: hotelData.image,
          image2: hotelData.image2,
          rooms: hotelData.rooms,
        };
        fetchedHotels.push(hotel);
      });

      setHotels(fetchedHotels);
    } catch (error) {
      console.log("Error fetching hotels:", error);
    }
  };

  return (
    <div>
      <h2>Hotels List</h2>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 2,
        }}
        dataSource={hotels}
        renderItem={(item) => (
          <List.Item
            key={item.name}
            style={{ display: "flex", alignItems: "left" }} // Adjusted style here
          >
            <div style={{ marginRight: "20px" }}>
              <Avatar
                shape="square"
                size={200}
                style={{ width: "600px", height: "250px" }}
                src={item.image2}
              />
            </div>
            <div>
              <List.Item.Meta
                title={
                  <Title level={4} style={{ margin: 0 }}>
                    <Link to={`/home/hotel_details/${item.id_hotel}`}>
                      {item.name}
                    </Link>
                  </Title>
                }
                description={
                  <Title level={5} style={{ margin: 0 }}>
                    {item.location}
                  </Title>
                }
              />

              <Space>
                <div>Rooms: {item.rooms} </div>
                <span
                  style={{
                    borderLeft: "1px solid #ccc",
                    marginLeft: "10px",
                    marginRight: "10px",
                    paddingLeft: "10px",
                  }}
                />
                <div>Capacity: {50}</div>
              </Space>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Hotels;

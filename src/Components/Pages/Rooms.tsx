import { Avatar, List, Space, Typography } from "antd";
import { Link } from "react-router-dom";
const { Title } = Typography;

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";

interface Room {
  id: string;
  image: string;
  name: string;
  hotel_id: string;
  price: string;
  capacity: string;
  bed_type: string;
}

interface RoomsProps {
  hotelId: string;
}
const image =
  "https://firebasestorage.googleapis.com/v0/b/project1-ed601.appspot.com/o/images%2Froom3.jpeg_90700101-e47b-448d-a1c2-347412565048?alt=media&token=e0751352-e557-4881-9ebf-fcba444b4a81";
const image2 =
  "https://firebasestorage.googleapis.com/v0/b/project1-ed601.appspot.com/o/images%2Froom4.jpg_4778601d-3aec-49f4-9d4e-ecc0047f8b2e?alt=media&token=c21b73a3-fcba-4b56-8146-66d45431c68d";
const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const roomsCollectionRef = collection(db, "rooms");
      const roomsQuery = query(
        roomsCollectionRef
        // where("hotel_id", "==", hotelId)
      );
      const snapshot = await getDocs(roomsQuery);

      const fetchedRooms: Room[] = [];
      snapshot.forEach((doc) => {
        const roomData = doc.data();
        const room: Room = {
          id: doc.id,
          image: roomData.image,
          name: roomData.name,
          hotel_id: roomData.hotel_id,
          price: roomData.price,
          capacity: roomData.capacity,
          bed_type: roomData.bed_type,
        };
        fetchedRooms.push(room);
      });

      setRooms(fetchedRooms);
    } catch (error) {
      console.log("Error fetching rooms:", error);
    }
  };
  return (
    <div>
      <h2>Rooms List</h2>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 2,
        }}
        dataSource={rooms}
        renderItem={(room, index) => (
          <List.Item
            key={room.id}
            style={{ display: "flex", alignItems: "left" }}
          >
            <div style={{ marginRight: "20px" }}>
              <Avatar
                shape="square"
                size={200}
                style={{ width: "600px", height: "250px" }}
                src={index % 2 === 0 ? image : image2}
              />
            </div>
            <div>
              <List.Item.Meta
                title={
                  <Title level={4} style={{ margin: 0 }}>
                    {room.name}
                  </Title>
                }
                description={
                  <Title level={5} style={{ margin: 0 }}>
                    Price: ${room.price}
                  </Title>
                }
              />

              <Space>
                <div>Capacity: {room.capacity}</div>
                <span
                  style={{
                    borderLeft: "1px solid #ccc",
                    marginLeft: "10px",
                    marginRight: "10px",
                    paddingLeft: "10px",
                  }}
                />
                <div>Bed Type: {room.bed_type}</div>
              </Space>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Rooms;

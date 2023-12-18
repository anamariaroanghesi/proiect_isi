import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 as uuidv4 } from "uuid";

export const AddHotel = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idHotel, setIdHotel] = useState("");
  const [rooms, setRooms] = useState("");
  const [error, setError] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [image, setImage] = useState<string>("");
  const [image2, setImage2] = useState<string>("");

  const navigate = useNavigate();

  const uploadFile = (hotelName: string) => {
    if (imageUpload === null) return;
    const imageRef = ref(storage, `${hotelName}/${hotelName}.jpg`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImage(url);
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (
      name === "" ||
      location === "" ||
      phoneNumber === "" ||
      idHotel === "" ||
      imageUpload === null ||
      rooms === ""
    ) {
      setError(true);
      return;
    }

    try {
      // Upload the image to Firebase Storage
      const imageRef = ref(storage, `${name}/${name}.jpg`);
      await uploadBytes(imageRef, imageUpload);
      const imageUrl = await getDownloadURL(imageRef);

      // Create the hotel object
      const hotelData = {
        name: name,
        location: location,
        phoneNumber: phoneNumber,
        id_hotel: idHotel,
        image: `${name}.jpg`,
        image2: imageUrl,
        rooms: rooms,
        rating: 4,
      };

      // Save the hotel to the "hotels" collection in Firestore
      const hotelsCollection = collection(db, "hotels");
      await setDoc(doc(hotelsCollection), hotelData);

      console.log("Hotel registration successful");
      // Redirect to another page or perform any other actions upon successful registration
      navigate("/home/hotels");
    } catch (error) {
      console.log("Error registering hotel:", error);
      // Handle registration error, display error message, etc.
    }
  };

  return (
    <div className="auth-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <header>Add Hotel</header>
        <label htmlFor="name">Hotel name</label>
        <input
          type="text"
          value={name}
          placeholder="Hotel name"
          id="name"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="location">Location</label>
        <input
          type="text"
          value={location}
          placeholder="Location"
          id="location"
          name="location"
          onChange={(e) => setLocation(e.target.value)}
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
        <label htmlFor="idHotel">Hotel ID</label>
        <input
          type="text"
          value={idHotel}
          placeholder="Hotel ID"
          id="idHotel"
          name="idHotel"
          onChange={(e) => setIdHotel(e.target.value)}
        />
        <label htmlFor="image">Image</label>
        <input
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setImageUpload(file || null);
          }}
        />
        <button onClick={() => uploadFile(name)}>Upload Image</button>
        {image && <img src={image2} alt="Hotel" />}
        <p></p>
        <label htmlFor="rooms">Number of Rooms</label>
        <input
          type="text"
          value={rooms}
          placeholder="Number of Rooms"
          id="rooms"
          name="rooms"
          onChange={(e) => setRooms(e.target.value)}
        />
        {error && (
          <div className="alert alert-danger">All fields need to be filled</div>
        )}
        <button type="submit">Add Hotel</button>
        <a
          href="#"
          className="register-link"
          onClick={() => navigate("/home/hotels")}
        >
          Go back to main page
        </a>
      </form>
    </div>
  );
};

export default AddHotel;

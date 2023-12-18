import React, { useState } from "react";
import { db, storage } from "../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export const AddRoom = () => {
  const [bedCount, setBedCount] = useState("");
  const [bedType, setBedType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [id, setId] = useState("");
  const [idHotel, setIdHotel] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [image, setImage] = useState<string>("");

  const navigate = useNavigate();

  const uploadFile = () => {
    if (imageUpload === null) return;
    const imageRef = ref(storage, `images/${imageUpload.name}_${uuidv4()}`);
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
      bedCount === "" ||
      bedType === "" ||
      capacity === "" ||
      id === "" ||
      idHotel === "" ||
      image === null ||
      name === "" ||
      price === ""
    ) {
      setError(true);
      return;
    }

    try {
      const roomData = {
        bed_count: bedCount,
        bed_type: bedType,
        capacity: capacity,
        id: id,
        id_hotel: idHotel,
        image: image,
        name: name,
        price: price,
      };

      const roomsCollection = collection(db, "rooms");
      await setDoc(doc(roomsCollection), roomData);

      console.log("Room registration successful");
      // Redirect to another page or perform any other actions upon successful registration
      navigate("/home/hotels");
    } catch (error) {
      console.log("Error registering room:", error);
      // Handle registration error, display error message, etc.
    }
  };

  return (
    <div className="auth-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <header>Add Room</header>
        <label htmlFor="bedCount">Bed Count</label>
        <input
          type="text"
          value={bedCount}
          placeholder="Bed Count"
          id="bedCount"
          name="bedCount"
          onChange={(e) => setBedCount(e.target.value)}
        />
        <label htmlFor="bedType">Bed Type</label>
        <input
          type="text"
          value={bedType}
          placeholder="Bed Type"
          id="bedType"
          name="bedType"
          onChange={(e) => setBedType(e.target.value)}
        />
        <label htmlFor="capacity">Capacity</label>
        <input
          type="text"
          value={capacity}
          placeholder="Capacity"
          id="capacity"
          name="capacity"
          onChange={(e) => setCapacity(e.target.value)}
        />
        <label htmlFor="id">Room ID</label>
        <input
          type="text"
          value={id}
          placeholder="Room ID"
          id="id"
          name="id"
          onChange={(e) => setId(e.target.value)}
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
        <button onClick={uploadFile}>Upload Image</button>
        {image && <img src={image} alt="Hotel" />}
        <p></p>
        <label htmlFor="name">Room Name</label>
        <input
          type="text"
          value={name}
          placeholder="Room Name"
          id="name"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="price">Price</label>
        <input
          type="text"
          value={price}
          placeholder="Price"
          id="price"
          name="price"
          onChange={(e) => setPrice(e.target.value)}
        />
        {error && (
          <div className="alert alert-danger">All fields need to be filled</div>
        )}
        <button type="submit">Add Room</button>
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

export default AddRoom;

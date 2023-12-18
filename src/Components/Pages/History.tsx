import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

interface Reservation {
  id: string;
  hotel: string;
  period: string;
  room: string;
  status: string;
}

const History: React.FC = () => {
  const [finishedReservations, setFinishedReservations] = useState<
    Reservation[]
  >([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const reservationsRef = collection(db, "reservations");
      const reservationsQuery = query(
        reservationsRef,
        where("status", "==", "finished")
      );
      const snapshot = await getDocs(reservationsQuery);

      const fetchedReservations: Reservation[] = [];
      snapshot.forEach((doc) => {
        const reservationData = doc.data();
        const reservation: Reservation = {
          id: doc.id,
          hotel: reservationData.hotel,
          period: reservationData.period,
          room: reservationData.room,
          status: reservationData.status,
        };
        fetchedReservations.push(reservation);
      });

      setFinishedReservations(fetchedReservations);
    } catch (error) {
      console.log("Error fetching reservations:", error);
    }
  };

  return (
    <div>
      <h2>Finished Reservations</h2>
      {finishedReservations.length > 0 ? (
        <ul>
          {finishedReservations.map((reservation) => (
            <li key={reservation.id}>
              <p>Reservation ID: {reservation.id}</p>
              <p>Hotel: {reservation.hotel}</p>
              <p>Period: {reservation.period}</p>
              <p>Room: {reservation.room}</p>
              <p>Status: {reservation.status}</p>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No finished reservations found.</p>
      )}
    </div>
  );
};

export default History;

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./PendingReservations.css";
import { Button } from "@mui/material";

interface Reservation {
  id: string;
  hotel: string;
  period: string;
  room: string;
  status: string;
}

const ReservationsList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const reservationsRef = collection(db, "reservations");
      const reservationsQuery = query(
        reservationsRef,
        where("status", "==", "pending")
      );
      const snapshot = await getDocs(reservationsQuery);

      const fetchedReservations: Reservation[] = [];
      snapshot.forEach((doc: DocumentData) => {
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

      setReservations(fetchedReservations);
    } catch (error) {
      console.log("Error fetching reservations:", error);
    }
  };

  const handleAccept = async (reservationId: string) => {
    try {
      const reservationRef = doc(db, "reservations", reservationId);
      await updateDoc(reservationRef, { status: "accepted" });
      console.log(`Reservation with ID: ${reservationId} accepted.`);

      // Update the state to reflect the updated reservation status
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: "accepted" }
            : reservation
        )
      );
    } catch (error) {
      console.log("Error accepting reservation:", error);
    }
  };

  const handleCancel = async (reservationId: string) => {
    try {
      await deleteDoc(doc(db, "reservations", reservationId));
      console.log(
        `Reservation with ID: ${reservationId} deleted successfully.`
      );

      // Update the state to remove the deleted reservation
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id !== reservationId
        )
      );
    } catch (error) {
      console.log("Error deleting reservation:", error);
    }
  };

  return (
    <div>
      <h2>Pending Reservations</h2>
      {reservations.length > 0 ? (
        <ul className="reservation-list">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="reservation-item">
              <div className="reservation-details">
                <p className="reservation-id">
                  Reservation ID: {reservation.id}
                </p>
                <p>Hotel: {reservation.hotel}</p>
                <p>Period: {reservation.period}</p>
                <p>Room: {reservation.room}</p>
                <p>Status: {reservation.status}</p>
              </div>
              <div className="reservation-actions">
                <button
                  className="accept-button"
                  onClick={() => handleAccept(reservation.id)}
                >
                  Accept
                </button>
                <button
                  className="cancel-button"
                  onClick={() => handleCancel(reservation.id)}
                >
                  Cancel
                </button>
              </div>
              <hr className="separator" />
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending reservations found.</p>
      )}
    </div>
  );
};

export default ReservationsList;

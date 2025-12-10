/**
 * Customer Booking Integration Example
 * 
 * This file shows how to integrate the seat selection from DetailFoldElement
 * with the admin panel's showtime and booking system.
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";

interface BookingData {
  userId: string;
  userName?: string;
  userEmail?: string;
  showtimeId: string;
  movieId: string;
  movieTitle: string;
  seats: Array<{ row: number; seat: number }>;
  totalPrice: number;
  datetime: Date;
  auditorium: string;
  language: string;
}

/**
 * Create a booking and update seat availability in the showtime
 * This uses a Firestore transaction to ensure data consistency
 */
export async function createCustomerBooking(
  bookingData: BookingData
): Promise<string> {
  try {
    const bookingId = await runTransaction(db, async (transaction) => {
      // 1. Get the showtime document
      const showtimeRef = doc(db, "showtimes", bookingData.showtimeId);
      const showtimeDoc = await transaction.get(showtimeRef);

      if (!showtimeDoc.exists()) {
        throw new Error("Showtime not found");
      }

      const showtimeData = showtimeDoc.data();
      const seatMap = showtimeData.seatMap;

      // 2. Verify all seats are available
      for (const seat of bookingData.seats) {
        const rowIndex = seat.row - 1;
        const seatIndex = seat.seat - 1;

        if (
          !seatMap[rowIndex] ||
          !seatMap[rowIndex][seatIndex] ||
          seatMap[rowIndex][seatIndex].status !== "available"
        ) {
          throw new Error(
            `Seat ${seat.row}-${seat.seat} is not available`
          );
        }
      }

      // 3. Mark seats as taken in seatMap
      const updatedSeatMap = JSON.parse(JSON.stringify(seatMap));
      for (const seat of bookingData.seats) {
        const rowIndex = seat.row - 1;
        const seatIndex = seat.seat - 1;
        updatedSeatMap[rowIndex][seatIndex].status = "taken";
      }

      // 4. Calculate new available seats count
      const newSeatsAvailable =
        showtimeData.seatsAvailable - bookingData.seats.length;

      // 5. Update showtime
      transaction.update(showtimeRef, {
        seatMap: updatedSeatMap,
        seatsAvailable: newSeatsAvailable,
        updatedAt: serverTimestamp(),
      });

      // 6. Create booking document
      const bookingsRef = collection(db, "bookings");
      const newBookingRef = doc(bookingsRef);
      
      transaction.set(newBookingRef, {
        userId: bookingData.userId,
        userName: bookingData.userName,
        userEmail: bookingData.userEmail,
        showtimeId: bookingData.showtimeId,
        movieId: bookingData.movieId,
        movieTitle: bookingData.movieTitle,
        seats: bookingData.seats,
        totalPrice: bookingData.totalPrice,
        datetime: bookingData.datetime,
        auditorium: bookingData.auditorium,
        language: bookingData.language,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return newBookingRef.id;
    });

    console.log("Booking created successfully:", bookingId);
    return bookingId;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

/**
 * Cancel a booking and release the seats back to available
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      // 1. Get booking
      const bookingRef = doc(db, "bookings", bookingId);
      const bookingDoc = await transaction.get(bookingRef);

      if (!bookingDoc.exists()) {
        throw new Error("Booking not found");
      }

      const bookingData = bookingDoc.data();

      if (bookingData.status === "refunded") {
        throw new Error("Booking already refunded");
      }

      // 2. Get showtime
      const showtimeRef = doc(db, "showtimes", bookingData.showtimeId);
      const showtimeDoc = await transaction.get(showtimeRef);

      if (!showtimeDoc.exists()) {
        throw new Error("Showtime not found");
      }

      const showtimeData = showtimeDoc.data();
      const seatMap = JSON.parse(JSON.stringify(showtimeData.seatMap));

      // 3. Release seats
      for (const seat of bookingData.seats) {
        const rowIndex = seat.row - 1;
        const seatIndex = seat.seat - 1;
        if (seatMap[rowIndex] && seatMap[rowIndex][seatIndex]) {
          seatMap[rowIndex][seatIndex].status = "available";
        }
      }

      // 4. Update showtime
      const newSeatsAvailable =
        showtimeData.seatsAvailable + bookingData.seats.length;

      transaction.update(showtimeRef, {
        seatMap: seatMap,
        seatsAvailable: newSeatsAvailable,
        updatedAt: serverTimestamp(),
      });

      // 5. Update booking status
      transaction.update(bookingRef, {
        status: "refunded",
        updatedAt: serverTimestamp(),
      });
    });

    console.log("Booking cancelled successfully");
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
}

/**
 * Example integration with DetailFoldElement
 * This would be called from the payment page after successful payment
 */
export async function handlePaymentSuccess(
  userId: string,
  userName: string,
  userEmail: string,
  showtimeId: string,
  movieId: string,
  movieTitle: string,
  selectedSeats: Array<{ row: number; seat: number }>,
  datetime: Date,
  auditorium: string,
  language: string,
  pricePerSeat: number
): Promise<string> {
  const totalPrice = selectedSeats.length * pricePerSeat;

  const bookingData: BookingData = {
    userId,
    userName,
    userEmail,
    showtimeId,
    movieId,
    movieTitle,
    seats: selectedSeats,
    totalPrice,
    datetime,
    auditorium,
    language,
  };

  try {
    // Create the booking
    const bookingId = await createCustomerBooking(bookingData);

    // Mark as paid
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status: "paid",
      paidAt: serverTimestamp(),
    });

    return bookingId;
  } catch (error) {
    console.error("Payment processing failed:", error);
    throw error;
  }
}

/**
 * Get available showtimes for a movie
 */
export async function getAvailableShowtimes(movieId: string) {
  const { collection, query, where, orderBy, getDocs } = await import(
    "firebase/firestore"
  );

  const showtimesRef = collection(db, "showtimes");
  const q = query(
    showtimesRef,
    where("movieId", "==", movieId),
    where("status", "==", "on_sale"),
    orderBy("datetime", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    datetime: doc.data().datetime?.toDate(),
  }));
}

/**
 * Check if specific seats are available
 */
export async function checkSeatsAvailability(
  showtimeId: string,
  seats: Array<{ row: number; seat: number }>
): Promise<boolean> {
  try {
    const showtimeRef = doc(db, "showtimes", showtimeId);
    const showtimeDoc = await getDoc(showtimeRef);

    if (!showtimeDoc.exists()) {
      return false;
    }

    const seatMap = showtimeDoc.data().seatMap;

    for (const seat of seats) {
      const rowIndex = seat.row - 1;
      const seatIndex = seat.seat - 1;

      if (
        !seatMap[rowIndex] ||
        !seatMap[rowIndex][seatIndex] ||
        seatMap[rowIndex][seatIndex].status !== "available"
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error checking seat availability:", error);
    return false;
  }
}

// Example usage in your payment page:
/*
import { handlePaymentSuccess } from '@/lib/bookingIntegration';
import { auth } from '@/lib/firebase';

async function processPayment() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  
  const bookingId = await handlePaymentSuccess(
    user.uid,
    user.displayName || 'Guest',
    user.email || '',
    showtimeId,
    movieId,
    movieTitle,
    selectedSeats,
    showDateTime,
    auditorium,
    language,
    pricePerSeat
  );
  
  // Redirect to ticket page
  router.push(\`/ticket/\${bookingId}\`);
}
*/

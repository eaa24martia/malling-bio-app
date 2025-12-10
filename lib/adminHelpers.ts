/**
 * Admin Helper Functions
 * Utility functions for managing movies, showtimes, and bookings in Firebase Firestore
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ============= MOVIE OPERATIONS =============

export interface MovieInput {
  title: string;
  originalTitle: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  posterUrl: string;
  trailerUrl?: string;
  genres: string[];
  runtimeMinutes: number;
  ageRating: string;
  languages: string[];
  featured: boolean;
}

/**
 * Create a new movie in Firestore
 * @param movieData - Movie data to create
 * @returns Document ID of the created movie
 */
export async function createMovie(movieData: MovieInput): Promise<string> {
  try {
    const moviesRef = collection(db, "movies");
    const docRef = await addDoc(moviesRef, {
      ...movieData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Movie created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating movie:", error);
    throw new Error("Failed to create movie");
  }
}

/**
 * Update an existing movie
 * @param movieId - ID of the movie to update
 * @param updates - Partial movie data to update
 */
export async function updateMovie(
  movieId: string,
  updates: Partial<MovieInput>
): Promise<void> {
  try {
    const movieRef = doc(db, "movies", movieId);
    await updateDoc(movieRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log("Movie updated:", movieId);
  } catch (error) {
    console.error("Error updating movie:", error);
    throw new Error("Failed to update movie");
  }
}

/**
 * Delete a movie from Firestore
 * @param movieId - ID of the movie to delete
 */
export async function deleteMovie(movieId: string): Promise<void> {
  try {
    const movieRef = doc(db, "movies", movieId);
    await deleteDoc(movieRef);
    console.log("Movie deleted:", movieId);
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw new Error("Failed to delete movie");
  }
}

// ============= SHOWTIME OPERATIONS =============

export interface SeatStatus {
  row: number;
  seat: number;
  status: "available" | "taken" | "handicap";
}

export interface ShowtimeInput {
  movieId: string;
  datetime: Date;
  auditorium: string;
  language: string;
  price: number;
  totalSeats: number;
  seatsAvailable: number;
  seatMap: SeatStatus[][];
  status: "on_sale" | "cancelled";
}

/**
 * Create a new showtime in Firestore
 * @param showtimeData - Showtime data to create
 * @returns Document ID of the created showtime
 */
export async function createShowtime(
  showtimeData: ShowtimeInput
): Promise<string> {
  try {
    const showtimesRef = collection(db, "showtimes");
    const docRef = await addDoc(showtimesRef, {
      ...showtimeData,
      datetime: Timestamp.fromDate(showtimeData.datetime),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Showtime created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating showtime:", error);
    throw new Error("Failed to create showtime");
  }
}

/**
 * Update an existing showtime
 * @param showtimeId - ID of the showtime to update
 * @param updates - Partial showtime data to update
 */
export async function updateShowtime(
  showtimeId: string,
  updates: Partial<ShowtimeInput>
): Promise<void> {
  try {
    const showtimeRef = doc(db, "showtimes", showtimeId);
    const updateData: any = { ...updates, updatedAt: serverTimestamp() };
    
    // Convert datetime to Timestamp if it exists
    if (updates.datetime) {
      updateData.datetime = Timestamp.fromDate(updates.datetime);
    }
    
    await updateDoc(showtimeRef, updateData);
    console.log("Showtime updated:", showtimeId);
  } catch (error) {
    console.error("Error updating showtime:", error);
    throw new Error("Failed to update showtime");
  }
}

/**
 * Delete a showtime from Firestore
 * @param showtimeId - ID of the showtime to delete
 */
export async function deleteShowtime(showtimeId: string): Promise<void> {
  try {
    const showtimeRef = doc(db, "showtimes", showtimeId);
    await deleteDoc(showtimeRef);
    console.log("Showtime deleted:", showtimeId);
  } catch (error) {
    console.error("Error deleting showtime:", error);
    throw new Error("Failed to delete showtime");
  }
}

/**
 * Generate a default seat map
 * @param rows - Number of rows
 * @param seatsPerRow - Number of seats per row
 * @returns 2D array of seat statuses
 */
export function generateDefaultSeatMap(
  rows: number,
  seatsPerRow: number
): SeatStatus[][] {
  const seatMap: SeatStatus[][] = [];
  
  for (let row = 0; row < rows; row++) {
    const rowSeats: SeatStatus[] = [];
    for (let seat = 0; seat < seatsPerRow; seat++) {
      // Last row, last 2 seats are handicap accessible
      const isHandicap = row === rows - 1 && seat >= seatsPerRow - 2;
      
      rowSeats.push({
        row: row + 1,
        seat: seat + 1,
        status: isHandicap ? "handicap" : "available",
      });
    }
    seatMap.push(rowSeats);
  }
  
  return seatMap;
}

/**
 * Calculate available seats from seat map
 * @param seatMap - 2D array of seat statuses
 * @returns Number of available seats
 */
export function calculateAvailableSeats(seatMap: SeatStatus[][]): number {
  return seatMap.flat().filter((seat) => seat.status === "available").length;
}

// ============= BOOKING OPERATIONS =============

export interface BookingInput {
  userId: string;
  userName?: string;
  showtimeId: string;
  movieTitle?: string;
  seats: { row: number; seat: number }[];
  totalPrice: number;
  status: "pending" | "paid" | "refunded";
}

/**
 * Create a new booking
 * @param bookingData - Booking data to create
 * @returns Document ID of the created booking
 */
export async function createBooking(
  bookingData: BookingInput
): Promise<string> {
  try {
    const bookingsRef = collection(db, "bookings");
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Booking created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }
}

/**
 * Update booking status
 * @param bookingId - ID of the booking to update
 * @param status - New booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: "pending" | "paid" | "refunded"
): Promise<void> {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    console.log("Booking status updated:", bookingId, status);
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw new Error("Failed to update booking status");
  }
}

/**
 * Get bookings for a specific showtime
 * @param showtimeId - ID of the showtime
 * @returns Array of booking documents
 */
export async function getBookingsByShowtime(showtimeId: string) {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("showtimeId", "==", showtimeId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Failed to fetch bookings");
  }
}

// ============= ADMIN AUTH SETUP =============

/**
 * Instructions for setting up admin authentication:
 * 
 * 1. In Firebase Console, go to Authentication > Users
 * 2. Find the user you want to make admin
 * 3. Use Firebase Admin SDK or Firebase CLI to set custom claims:
 * 
 * Using Firebase Admin SDK (Node.js):
 * ```javascript
 * const admin = require('firebase-admin');
 * admin.initializeApp();
 * 
 * admin.auth().setCustomUserClaims(uid, { admin: true })
 *   .then(() => console.log('Admin claim set successfully'))
 *   .catch(error => console.error('Error setting admin claim:', error));
 * ```
 * 
 * Using Firebase CLI:
 * ```bash
 * firebase functions:shell
 * > admin.auth().setCustomUserClaims('USER_UID', { admin: true })
 * ```
 * 
 * 4. User must sign out and sign in again for claims to take effect
 * 5. Check admin status in your app:
 * ```javascript
 * const user = auth.currentUser;
 * const idTokenResult = await user.getIdTokenResult();
 * const isAdmin = idTokenResult.claims.admin === true;
 * ```
 */

export const adminSetupInstructions = `
To set up admin access:

1. Install Firebase Admin SDK in a secure environment (not in client code)
2. Use the following code to grant admin privileges:

const admin = require('firebase-admin');
admin.initializeApp();

async function makeUserAdmin(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log('Successfully set admin claim for user:', uid);
  } catch (error) {
    console.error('Error setting admin claim:', error);
  }
}

makeUserAdmin('YOUR_USER_UID_HERE');

3. Deploy Firestore rules from firestore.rules file
4. User must sign out and sign back in for changes to take effect
`;

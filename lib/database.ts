import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Types for your data models
export interface Movie {
  id?: string;
  title: string;
  image: string;
  description?: string;
  releaseDate?: Date;
  genre?: string[];
  duration?: number;
  rating?: string;
  isUpcoming?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  image?: string;
  date: Date;
  location?: string;
  price?: number;
  availableSeats?: number;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id?: string;
  email: string;
  displayName?: string;
  profileImage?: string;
  favoriteMovies?: string[];
  bookings?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Movies Collection Operations
export const movieService = {
  // Get all movies
  async getAllMovies(): Promise<Movie[]> {
    try {
      const moviesRef = collection(db, 'movies');
      const snapshot = await getDocs(moviesRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        releaseDate: doc.data().releaseDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as Movie));
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  // Get current movies (not upcoming)
  async getCurrentMovies(): Promise<Movie[]> {
    try {
      const moviesRef = collection(db, 'movies');
      const q = query(moviesRef, where('isUpcoming', '==', false));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        releaseDate: doc.data().releaseDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as Movie));
    } catch (error) {
      console.error('Error fetching current movies:', error);
      throw error;
    }
  },

  // Get upcoming movies
  async getUpcomingMovies(): Promise<Movie[]> {
    try {
      const moviesRef = collection(db, 'movies');
      const q = query(moviesRef, where('isUpcoming', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        releaseDate: doc.data().releaseDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as Movie));
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },

  // Add a new movie
  async addMovie(movie: Omit<Movie, 'id'>): Promise<string> {
    try {
      const moviesRef = collection(db, 'movies');
      const movieData = {
        ...movie,
        releaseDate: movie.releaseDate ? Timestamp.fromDate(movie.releaseDate) : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(moviesRef, movieData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding movie:', error);
      throw error;
    }
  },

  // Update a movie
  async updateMovie(movieId: string, updates: Partial<Movie>): Promise<void> {
    try {
      const movieRef = doc(db, 'movies', movieId);
      const updateData = {
        ...updates,
        releaseDate: updates.releaseDate ? Timestamp.fromDate(updates.releaseDate) : undefined,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(movieRef, updateData);
    } catch (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
  },

  // Delete a movie
  async deleteMovie(movieId: string): Promise<void> {
    try {
      const movieRef = doc(db, 'movies', movieId);
      await deleteDoc(movieRef);
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  },
};

// Events Collection Operations
export const eventService = {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as Event));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get upcoming events
  async getUpcomingEvents(): Promise<Event[]> {
    try {
      const eventsRef = collection(db, 'events');
      const now = Timestamp.now();
      const q = query(
        eventsRef, 
        where('date', '>=', now), 
        orderBy('date', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as Event));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  },

  // Add a new event
  async addEvent(event: Omit<Event, 'id'>): Promise<string> {
    try {
      const eventsRef = collection(db, 'events');
      const eventData = {
        ...event,
        date: Timestamp.fromDate(event.date),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(eventsRef, eventData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  },
};

// User Collection Operations
export const userService = {
  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data(),
          createdAt: snapshot.data().createdAt?.toDate(),
          updatedAt: snapshot.data().updatedAt?.toDate(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create or update user
  async createOrUpdateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const updateData = {
        ...userData,
        updatedAt: Timestamp.now(),
        createdAt: userData.createdAt || Timestamp.now(),
      };
      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },
};

// Real-time listeners
export const realtimeListeners = {
  // Listen to movies changes
  subscribeToMovies(callback: (movies: Movie[]) => void) {
    const moviesRef = collection(db, 'movies');
    return onSnapshot(moviesRef, (snapshot) => {
      const movies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        releaseDate: doc.data().releaseDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as Movie));
      callback(movies);
    });
  },

  // Listen to events changes
  subscribeToEvents(callback: (events: Event[]) => void) {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('date', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as Event));
      callback(events);
    });
  },
};

// Utility functions
export const dbUtils = {
  // Convert Date to Firestore Timestamp
  dateToTimestamp: (date: Date) => Timestamp.fromDate(date),
  
  // Convert Firestore Timestamp to Date
  timestampToDate: (timestamp: any) => timestamp?.toDate() || null,
  
  // Get current timestamp
  now: () => Timestamp.now(),
};

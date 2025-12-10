"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Types
interface Movie {
  id?: string;
  title: string;
  originalTitle: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  genres: string[];
  runtimeMinutes: number;
  ageRating: string;
  ageRatingImageUrl?: string;
  languages: string[];
  featured: boolean;
  isUpcoming: boolean;
  isPopular: boolean;
  popularOrder?: number;
  createdAt?: any;
  updatedAt?: any;
}

interface Showtime {
  id?: string;
  movieId: string;
  datetime: Date;
  auditorium: string;
  language: string;
  price: number;
  totalSeats: number;
  seatsAvailable: number;
  seatMap: SeatStatus[][];
  status: "on_sale" | "cancelled";
  createdAt?: any;
  updatedAt?: any;
}

interface SeatStatus {
  row: number;
  seat: number;
  status: "available" | "taken" | "handicap";
}

interface Booking {
  id?: string;
  userId: string;
  userName?: string;
  showtimeId: string;
  movieTitle?: string;
  seats: { row: number; seat: number }[];
  totalPrice: number;
  status: "pending" | "paid" | "refunded";
  createdAt?: any;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"movies" | "upcoming" | "showtimes" | "bookings">("movies");
  
  // Movies state
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [movieForm, setMovieForm] = useState<Partial<Movie>>({
    title: "",
    originalTitle: "",
    slug: "",
    shortDescription: "",
    longDescription: "",
    posterUrl: "",
    backdropUrl: "",
    trailerUrl: "",
    genres: [],
    runtimeMinutes: 0,
    ageRating: "",
    ageRatingImageUrl: "",
    languages: [],
    featured: false,
    isUpcoming: false,
    isPopular: false,
    popularOrder: 0,
  });

  // Showtimes state
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [showtimeForm, setShowtimeForm] = useState<Partial<Showtime>>({
    movieId: "",
    datetime: new Date(),
    auditorium: "Sal 1",
    language: "Dansk tale",
    price: 100,
    totalSeats: 0,
    seatsAvailable: 0,
    seatMap: [],
    status: "on_sale",
  });
  const [seatMapRows, setSeatMapRows] = useState(8);
  const [seatMapCols, setSeatMapCols] = useState(12);

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterShowtimeId, setFilterShowtimeId] = useState<string>("");

  // Load data
  useEffect(() => {
    loadMovies();
    loadShowtimes();
    loadBookings();
  }, []);

  const loadMovies = async () => {
    try {
      const moviesRef = collection(db, "movies");
      const snapshot = await getDocs(moviesRef);
      const moviesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Movie));
      setMovies(moviesData);
    } catch (error) {
      console.error("Error loading movies:", error);
    }
  };

  const loadShowtimes = async () => {
    try {
      const showtimesRef = collection(db, "showtimes");
      const q = query(showtimesRef, orderBy("datetime", "desc"));
      const snapshot = await getDocs(q);
      const showtimesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          datetime: data.datetime?.toDate(),
        } as Showtime;
      });
      setShowtimes(showtimesData);
    } catch (error) {
      console.error("Error loading showtimes:", error);
    }
  };

  const loadBookings = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Booking));
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  // Movie operations
  const handleSaveMovie = async () => {
    try {
      if (editingMovie?.id) {
        // Update existing movie
        const movieRef = doc(db, "movies", editingMovie.id);
        await updateDoc(movieRef, {
          ...movieForm,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new movie
        await addDoc(collection(db, "movies"), {
          ...movieForm,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      resetMovieForm();
      loadMovies();
    } catch (error) {
      console.error("Error saving movie:", error);
      alert("Error saving movie. Check console.");
    }
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setMovieForm(movie);
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    try {
      await deleteDoc(doc(db, "movies", movieId));
      loadMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const resetMovieForm = () => {
    setEditingMovie(null);
    setMovieForm({
      title: "",
      originalTitle: "",
      slug: "",
      shortDescription: "",
      longDescription: "",
      posterUrl: "",
      backdropUrl: "",
      trailerUrl: "",
      genres: [],
      runtimeMinutes: 0,
      ageRating: "",
      ageRatingImageUrl: "",
      languages: [],
      featured: false,
      isUpcoming: false,
      isPopular: false,
      popularOrder: 0,
    });
  };

  // Showtime operations - Generate default seat map (8 rows, 12 seats)
  const generateSeatMap = () => {
    const rows = 8;
    const cols = 12;
    const seatMap: SeatStatus[][] = [];
    
    for (let row = 0; row < rows; row++) {
      const rowSeats: SeatStatus[] = [];
      for (let seat = 0; seat < cols; seat++) {
        // Last row, last 2 seats are handicap
        const isHandicap = row === rows - 1 && seat >= cols - 2;
        rowSeats.push({
          row: row + 1,
          seat: seat + 1,
          status: isHandicap ? "handicap" : "available",
        });
      }
      seatMap.push(rowSeats);
    }
    
    setShowtimeForm({
      ...showtimeForm,
      seatMap,
      totalSeats: rows * cols,
      seatsAvailable: rows * cols,
    });
  };

  const toggleSeatStatus = (rowIndex: number, seatIndex: number) => {
    if (!showtimeForm.seatMap) return;
    const newSeatMap = [...showtimeForm.seatMap];
    const currentStatus = newSeatMap[rowIndex][seatIndex].status;
    
    // Cycle: available -> taken -> handicap -> available
    let newStatus: "available" | "taken" | "handicap" = "available";
    if (currentStatus === "available") newStatus = "taken";
    else if (currentStatus === "taken") newStatus = "handicap";
    else newStatus = "available";
    
    newSeatMap[rowIndex][seatIndex] = {
      ...newSeatMap[rowIndex][seatIndex],
      status: newStatus,
    };

    // Calculate available seats
    const availableCount = newSeatMap.flat().filter(s => s.status === "available").length;
    
    setShowtimeForm({
      ...showtimeForm,
      seatMap: newSeatMap,
      seatsAvailable: availableCount,
    });
  };

  const handleSaveShowtime = async () => {
    try {
      if (!showtimeForm.movieId) {
        alert("Please select a movie.");
        return;
      }

      // Generate seat map automatically if not exists
      let seatMapToSave = showtimeForm.seatMap;
      if (!seatMapToSave || seatMapToSave.length === 0) {
        const rows = 8;
        const cols = 12;
        const newSeatMap: SeatStatus[][] = [];
        
        for (let row = 0; row < rows; row++) {
          const rowSeats: SeatStatus[] = [];
          for (let seat = 0; seat < cols; seat++) {
            const isHandicap = row === rows - 1 && seat >= cols - 2;
            rowSeats.push({
              row: row + 1,
              seat: seat + 1,
              status: isHandicap ? "handicap" : "available",
            });
          }
          newSeatMap.push(rowSeats);
        }
        seatMapToSave = newSeatMap;
      }

      // Flatten the seat map to avoid nested arrays issue in Firestore
      const flatSeatMap = seatMapToSave.flat();

      const showtimeData = {
        movieId: showtimeForm.movieId,
        datetime: Timestamp.fromDate(showtimeForm.datetime || new Date()),
        auditorium: showtimeForm.auditorium,
        language: showtimeForm.language,
        price: showtimeForm.price,
        totalSeats: flatSeatMap.length,
        seatsAvailable: flatSeatMap.filter(s => s.status === "available").length,
        seatMap: flatSeatMap, // Store as flat array
        seatMapRows: 8,
        seatMapCols: 12,
        status: showtimeForm.status,
      };

      if (editingShowtime?.id) {
        // Update existing showtime
        const showtimeRef = doc(db, "showtimes", editingShowtime.id);
        await updateDoc(showtimeRef, {
          ...showtimeData,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new showtime
        await addDoc(collection(db, "showtimes"), {
          ...showtimeData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      resetShowtimeForm();
      loadShowtimes();
    } catch (error) {
      console.error("Error saving showtime:", error);
      alert("Error saving showtime. Check console.");
    }
  };

  const handleEditShowtime = (showtime: Showtime) => {
    setEditingShowtime(showtime);
    setShowtimeForm(showtime);
    if (showtime.seatMap) {
      setSeatMapRows(showtime.seatMap.length);
      setSeatMapCols(showtime.seatMap[0]?.length || 12);
    }
  };

  const handleDeleteShowtime = async (showtimeId: string) => {
    if (!confirm("Are you sure you want to delete this showtime?")) return;
    try {
      await deleteDoc(doc(db, "showtimes", showtimeId));
      loadShowtimes();
    } catch (error) {
      console.error("Error deleting showtime:", error);
    }
  };

  const resetShowtimeForm = () => {
    setEditingShowtime(null);
    setShowtimeForm({
      movieId: "",
      datetime: new Date(),
      auditorium: "Sal 1",
      language: "Dansk tale",
      price: 100,
      totalSeats: 0,
      seatsAvailable: 0,
      seatMap: [],
      status: "on_sale",
    });
  };

  // Booking operations
  const handleUpdateBookingStatus = async (bookingId: string, status: "paid" | "refunded") => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      loadBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const getMovieTitle = (movieId: string) => {
    return movies.find(m => m.id === movieId)?.title || "Unknown";
  };

  const getSeatIcon = (status: string) => {
    switch (status) {
      case "available":
        return "/assets/seat-red.svg";
      case "taken":
        return "/assets/seat-indigo.svg";
      case "handicap":
        return "/assets/seat-handicap.svg";
      default:
        return "/assets/seat-red.svg";
    }
  };

  const filteredBookings = filterShowtimeId
    ? bookings.filter(b => b.showtimeId === filterShowtimeId)
    : bookings;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#000000] to-[#4B0009] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Malling Bio - Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/20">
          <button
            onClick={() => setActiveTab("movies")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "movies"
                ? "bg-[#B2182B] text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Aktuelle film
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "upcoming"
                ? "bg-[#B2182B] text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Kommende film
          </button>
          <button
            onClick={() => setActiveTab("showtimes")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "showtimes"
                ? "bg-[#B2182B] text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Showtimes
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "bookings"
                ? "bg-[#B2182B] text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Bookings
          </button>
        </div>

        {/* Movies Tab */}
        {activeTab === "movies" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Movie Form */}
            <div className="bg-[#410C10] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingMovie ? "Edit Movie" : "Create Movie"}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title *"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Original Title"
                  value={movieForm.originalTitle}
                  onChange={(e) => setMovieForm({ ...movieForm, originalTitle: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Slug (e.g., wicked-part-2)"
                  value={movieForm.slug}
                  onChange={(e) => setMovieForm({ ...movieForm, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <textarea
                  placeholder="Short Description"
                  value={movieForm.shortDescription}
                  onChange={(e) => setMovieForm({ ...movieForm, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B] h-20"
                />
                <textarea
                  placeholder="Long Description"
                  value={movieForm.longDescription}
                  onChange={(e) => setMovieForm({ ...movieForm, longDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B] h-32"
                />
                <input
                  type="text"
                  placeholder="Poster URL"
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Backdrop URL (optional)"
                  value={movieForm.backdropUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, backdropUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Trailer URL (optional)"
                  value={movieForm.trailerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Genres (comma-separated)"
                  value={movieForm.genres?.join(", ")}
                  onChange={(e) =>
                    setMovieForm({
                      ...movieForm,
                      genres: e.target.value.split(",").map(g => g.trim()),
                    })
                  }
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="number"
                  placeholder="Runtime (minutes)"
                  value={movieForm.runtimeMinutes}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, runtimeMinutes: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Age Rating (e.g., 11)"
                  value={movieForm.ageRating}
                  onChange={(e) => setMovieForm({ ...movieForm, ageRating: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Age Rating Image URL (optional)"
                  value={movieForm.ageRatingImageUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, ageRatingImageUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Languages (comma-separated)"
                  value={movieForm.languages?.join(", ")}
                  onChange={(e) =>
                    setMovieForm({
                      ...movieForm,
                      languages: e.target.value.split(",").map(l => l.trim()),
                    })
                  }
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={movieForm.featured}
                    onChange={(e) => setMovieForm({ ...movieForm, featured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Featured Movie</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={movieForm.isUpcoming}
                    onChange={(e) => setMovieForm({ ...movieForm, isUpcoming: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Kommende film (Upcoming)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={movieForm.isPopular}
                    onChange={(e) => setMovieForm({ ...movieForm, isPopular: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Populært nu (Popular)</span>
                </label>
                {movieForm.isPopular && (
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Display Order (lower = first)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={movieForm.popularOrder || 0}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, popularOrder: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveMovie}
                    className="flex-1 bg-[#B2182B] text-white px-6 py-3 rounded font-semibold hover:bg-[#8B1421] transition"
                  >
                    {editingMovie ? "Update Movie" : "Create Movie"}
                  </button>
                  {editingMovie && (
                    <button
                      onClick={resetMovieForm}
                      className="px-6 py-3 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Movies List */}
            <div className="bg-[#410C10] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Aktuelle film</h2>
              <div className="space-y-3 max-h-[800px] overflow-y-auto">
                {movies.filter(m => !m.isUpcoming).map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-[#670612] rounded p-4 flex items-start gap-4"
                  >
                    {movie.posterUrl && (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{movie.title}</h3>
                      <p className="text-sm text-white/70">{movie.originalTitle}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {movie.genres?.join(", ")} • {movie.runtimeMinutes} min • {movie.ageRating}
                      </p>
                      {movie.featured && (
                        <span className="inline-block mt-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                      {movie.isUpcoming && (
                        <span className="inline-block mt-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Kommende
                        </span>
                      )}
                      {movie.isPopular && (
                        <span className="inline-block mt-2 ml-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                          Populært (#{movie.popularOrder || 0})
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEditMovie(movie)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(movie.id!)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {movies.filter(m => !m.isUpcoming).length === 0 && (
                  <p className="text-white/50 text-center py-8">No current movies yet. Create one!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Movies Tab */}
        {activeTab === "upcoming" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Movie Form - Same as movies tab */}
            <div className="bg-[#410C10] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingMovie ? "Edit Movie" : "Create Movie"}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title *"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Original Title"
                  value={movieForm.originalTitle}
                  onChange={(e) => setMovieForm({ ...movieForm, originalTitle: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Slug (e.g., wicked-part-2)"
                  value={movieForm.slug}
                  onChange={(e) => setMovieForm({ ...movieForm, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <textarea
                  placeholder="Short Description"
                  value={movieForm.shortDescription}
                  onChange={(e) => setMovieForm({ ...movieForm, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B] h-20"
                />
                <textarea
                  placeholder="Long Description"
                  value={movieForm.longDescription}
                  onChange={(e) => setMovieForm({ ...movieForm, longDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B] h-32"
                />
                <input
                  type="text"
                  placeholder="Poster URL"
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Backdrop URL (optional)"
                  value={movieForm.backdropUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, backdropUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Trailer URL (optional)"
                  value={movieForm.trailerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Genres (comma-separated)"
                  value={movieForm.genres?.join(", ")}
                  onChange={(e) =>
                    setMovieForm({
                      ...movieForm,
                      genres: e.target.value.split(",").map(g => g.trim()),
                    })
                  }
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="number"
                  placeholder="Runtime (minutes)"
                  value={movieForm.runtimeMinutes}
                  onChange={(e) =>
                    setMovieForm({ ...movieForm, runtimeMinutes: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Age Rating (e.g., 11)"
                  value={movieForm.ageRating}
                  onChange={(e) => setMovieForm({ ...movieForm, ageRating: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Age Rating Image URL (optional)"
                  value={movieForm.ageRatingImageUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, ageRatingImageUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <input
                  type="text"
                  placeholder="Languages (comma-separated)"
                  value={movieForm.languages?.join(", ")}
                  onChange={(e) =>
                    setMovieForm({
                      ...movieForm,
                      languages: e.target.value.split(",").map(l => l.trim()),
                    })
                  }
                  className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={movieForm.featured}
                    onChange={(e) => setMovieForm({ ...movieForm, featured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Featured Movie</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={movieForm.isUpcoming}
                    onChange={(e) => setMovieForm({ ...movieForm, isUpcoming: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Kommende film (Upcoming)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={movieForm.isPopular}
                    onChange={(e) => setMovieForm({ ...movieForm, isPopular: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Populært nu (Popular)</span>
                </label>
                {movieForm.isPopular && (
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Display Order (lower = first)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={movieForm.popularOrder || 0}
                      onChange={(e) =>
                        setMovieForm({ ...movieForm, popularOrder: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveMovie}
                    className="flex-1 bg-[#B2182B] text-white px-6 py-3 rounded font-semibold hover:bg-[#8B1421] transition"
                  >
                    {editingMovie ? "Update Movie" : "Create Movie"}
                  </button>
                  {editingMovie && (
                    <button
                      onClick={resetMovieForm}
                      className="px-6 py-3 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Movies List */}
            <div className="bg-[#410C10] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Kommende film</h2>
              <div className="space-y-3 max-h-[800px] overflow-y-auto">
                {movies.filter(m => m.isUpcoming).map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-[#670612] rounded p-4 flex items-start gap-4"
                  >
                    {movie.posterUrl && (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{movie.title}</h3>
                      <p className="text-sm text-white/70">{movie.originalTitle}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {movie.genres?.join(", ")} • {movie.runtimeMinutes} min • {movie.ageRating}
                      </p>
                      {movie.featured && (
                        <span className="inline-block mt-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                      {movie.isUpcoming && (
                        <span className="inline-block mt-2 ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Kommende
                        </span>
                      )}
                      {movie.isPopular && (
                        <span className="inline-block mt-2 ml-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                          Populært (#{movie.popularOrder || 0})
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEditMovie(movie)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(movie.id!)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {movies.filter(m => m.isUpcoming).length === 0 && (
                  <p className="text-white/50 text-center py-8">No upcoming movies yet. Create one!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Showtimes Tab */}
        {activeTab === "showtimes" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Showtime Form */}
            <div className="bg-[#410C10] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingShowtime ? "Edit Showtime" : "Create Showtime"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Vælg film *</label>
                  <select
                    value={showtimeForm.movieId}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, movieId: e.target.value })}
                    className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                  >
                    <option value="">Vælg en film...</option>
                    {movies.map((movie) => (
                      <option key={movie.id} value={movie.id}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Dato og tid</label>
                  <input
                    type="datetime-local"
                    value={
                      showtimeForm.datetime
                        ? new Date(showtimeForm.datetime.getTime() - showtimeForm.datetime.getTimezoneOffset() * 60000)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setShowtimeForm({ ...showtimeForm, datetime: new Date(e.target.value) })
                    }
                    className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Sal</label>
                  <select
                    value={showtimeForm.auditorium}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, auditorium: e.target.value })}
                    className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                  >
                    <option value="Sal 1">Sal 1</option>
                    <option value="Sal 2">Sal 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Sprog</label>
                  <select
                    value={showtimeForm.language}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, language: e.target.value })}
                    className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                  >
                    <option value="Dansk tale">Dansk tale</option>
                    <option value="Eng. tale">Eng. tale</option>
                    <option value="Originalt sprog">Originalt sprog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Pris (kroner)</label>
                  <input
                    type="number"
                    placeholder="fx. 100"
                    value={showtimeForm.price}
                    onChange={(e) =>
                      setShowtimeForm({ ...showtimeForm, price: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Status</label>
                  <select
                    value={showtimeForm.status}
                    onChange={(e) =>
                      setShowtimeForm({ ...showtimeForm, status: e.target.value as "on_sale" | "cancelled" })
                    }
                    className="w-full px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
                  >
                    <option value="on_sale">Til salg</option>
                    <option value="cancelled">Aflyst</option>
                  </select>
                </div>

                <div className="bg-[#670612]/50 rounded p-4 text-sm text-white/70">
                  ℹ️ Sæder oprettes automatisk (8 rækker × 12 sæder)
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveShowtime}
                    className="flex-1 bg-[#B2182B] text-white px-6 py-3 rounded font-semibold hover:bg-[#8B1421] transition"
                  >
                    {editingShowtime ? "Update Showtime" : "Create Showtime"}
                  </button>
                  {editingShowtime && (
                    <button
                      onClick={resetShowtimeForm}
                      className="px-6 py-3 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Showtimes List */}
            <div className="bg-[#410C10] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Existing Showtimes</h2>
              <div className="space-y-3 max-h-[800px] overflow-y-auto">
                {showtimes.map((showtime) => (
                  <div key={showtime.id} className="bg-[#670612] rounded p-4">
                    <h3 className="font-bold">{getMovieTitle(showtime.movieId)}</h3>
                    <p className="text-sm text-white/70">
                      {showtime.datetime?.toLocaleString("da-DK")} • {showtime.auditorium}
                    </p>
                    <p className="text-sm text-white/70">
                      {showtime.language} • {showtime.price} kr
                    </p>
                    <p className="text-sm text-white/70">
                      Seats: {showtime.seatsAvailable} / {showtime.totalSeats} available
                    </p>
                    <span
                      className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                        showtime.status === "on_sale"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {showtime.status}
                    </span>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEditShowtime(showtime)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteShowtime(showtime.id!)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {showtimes.length === 0 && (
                  <p className="text-white/50 text-center py-8">No showtimes yet. Create one!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-[#410C10] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Bookings Overview</h2>
            
            {/* Filter */}
            <div className="mb-4">
              <select
                value={filterShowtimeId}
                onChange={(e) => setFilterShowtimeId(e.target.value)}
                className="w-full md:w-64 px-4 py-2 bg-[#670612] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#B2182B]"
              >
                <option value="">All Showtimes</option>
                {showtimes.map((showtime) => (
                  <option key={showtime.id} value={showtime.id}>
                    {getMovieTitle(showtime.movieId)} - {showtime.datetime?.toLocaleString("da-DK")}
                  </option>
                ))}
              </select>
            </div>

            {/* Bookings List */}
            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-[#670612] rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">
                        {booking.userName || `User ${booking.userId.slice(0, 8)}`}
                      </h3>
                      <p className="text-sm text-white/70">
                        Movie: {booking.movieTitle || "Unknown"}
                      </p>
                      <p className="text-sm text-white/70">
                        Seats: {booking.seats.map(s => `R${s.row}S${s.seat}`).join(", ")}
                      </p>
                      <p className="text-sm text-white/70">Total: {booking.totalPrice} kr</p>
                      <span
                        className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                          booking.status === "paid"
                            ? "bg-green-500 text-white"
                            : booking.status === "refunded"
                            ? "bg-gray-500 text-white"
                            : "bg-yellow-500 text-black"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleUpdateBookingStatus(booking.id!, "paid")}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                        >
                          Mark Paid
                        </button>
                      )}
                      {booking.status === "paid" && (
                        <button
                          onClick={() => handleUpdateBookingStatus(booking.id!, "refunded")}
                          className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredBookings.length === 0 && (
                <p className="text-white/50 text-center py-8">No bookings found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

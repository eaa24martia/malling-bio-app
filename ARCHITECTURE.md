# Malling Bio Admin Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Malling Bio App                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────┐                            ┌──────────────┐
│   Customer   │                            │    Admin     │
│   Interface  │                            │   Interface  │
└──────────────┘                            └──────────────┘
        │                                           │
        │                                           │
┌───────┴────────┐                          ┌──────┴───────┐
│  DetailFold    │                          │  AdminGuard  │
│  Element       │                          │  Component   │
│  - Se tider    │                          │  - Auth      │
│  - Seat picker │                          │    Check     │
└───────┬────────┘                          └──────┬───────┘
        │                                           │
        │                                           │
┌───────┴────────┐                          ┌──────┴───────┐
│  Payment Page  │                          │  Admin Panel │
│  - Checkout    │                          │  - Movies    │
│  - Confirmation│                          │  - Showtimes │
└───────┬────────┘                          │  - Bookings  │
        │                                   └──────┬───────┘
        │                                           │
        └────────────────┬──────────────────────────┘
                         │
                         ▼
              ┌─────────────────┐
              │  Integration    │
              │  Layer          │
              │  bookingInteg.ts│
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Firebase       │
              │  Firestore      │
              │  - movies       │
              │  - showtimes    │
              │  - bookings     │
              │  - users        │
              └─────────────────┘
```

## 🔄 Data Flow

### Customer Booking Flow
```
1. User Views Movie
   └─> DetailFoldElement.tsx
       └─> Displays movie info
       
2. User Clicks "Se tider"
   └─> Opens Times Modal
       └─> Fetches showtimes from Firestore
       └─> Displays available times
       
3. User Selects Time
   └─> Opens Seat Modal
       └─> Loads seat map from showtime
       └─> Displays interactive seat grid
       
4. User Selects Seats
   └─> Updates local state
       └─> Shows selected seats summary
       └─> Calculates total price
       
5. User Clicks "Betaling"
   └─> Goes to Payment Page
       └─> Processes payment
       
6. Payment Success
   └─> bookingIntegration.ts
       └─> createCustomerBooking()
           └─> Transaction:
               ├─> Verify seats available
               ├─> Update seat map (mark taken)
               ├─> Decrease seatsAvailable
               ├─> Create booking document
               └─> Return booking ID
               
7. Redirect to Ticket
   └─> /ticket/[bookingId]
       └─> Display confirmation
```

### Admin Management Flow
```
1. Admin Signs In
   └─> Firebase Auth
       └─> Check custom claim: admin = true
       
2. AdminGuard Protection
   └─> getIdTokenResult()
       └─> Verify admin claim
           ├─> True → Show admin panel
           └─> False → Redirect to home
           
3. Admin Creates Movie
   └─> Fill form in Movies tab
       └─> adminHelpers.createMovie()
           └─> addDoc(movies)
               └─> serverTimestamp()
               
4. Admin Creates Showtime
   └─> Select movie from dropdown
   └─> Set date/time, auditorium, price
   └─> Generate seat map
       └─> generateDefaultSeatMap(rows, cols)
           └─> Returns 2D array of seats
   └─> Optional: Toggle seat statuses
       └─> Available → Taken → Handicap
   └─> adminHelpers.createShowtime()
       └─> addDoc(showtimes)
           └─> Include full seat map
           
5. Admin Views Bookings
   └─> Bookings tab
       └─> getDocs(bookings)
           └─> Display list with filters
           └─> Actions:
               ├─> Mark as paid
               │   └─> updateBookingStatus(id, 'paid')
               └─> Issue refund
                   └─> updateBookingStatus(id, 'refunded')
                       └─> cancelBooking()
                           └─> Release seats
```

## 🔐 Security Flow

```
┌─────────────┐
│ User Signs  │
│     In      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Firebase    │
│ Auth        │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Custom Claims       │
│ { admin: true }     │
│ (Set by Admin SDK)  │
└──────┬──────────────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
       ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Client   │   │ Firestore│   │ Cloud    │
│ Side     │   │ Rules    │   │ Functions│
│ Check    │   │ Check    │   │ Check    │
│          │   │          │   │          │
│ AdminGua │   │ allow    │   │ context  │
│ rd       │   │ if       │   │ .auth    │
│          │   │ isAdmin()│   │ .token   │
│ getIdTok │   │          │   │ .admin   │
│ enResult │   │          │   │          │
└──────────┘   └──────────┘   └──────────┘
```

## 📊 Database Schema

```
Firestore Database
│
├─ movies/
│  └─ {movieId}
│     ├─ title: string
│     ├─ originalTitle: string
│     ├─ slug: string
│     ├─ shortDescription: string
│     ├─ longDescription: string
│     ├─ posterUrl: string
│     ├─ trailerUrl?: string
│     ├─ genres: string[]
│     ├─ runtimeMinutes: number
│     ├─ ageRating: string
│     ├─ languages: string[]
│     ├─ featured: boolean
│     ├─ createdAt: timestamp
│     └─ updatedAt: timestamp
│
├─ showtimes/
│  └─ {showtimeId}
│     ├─ movieId: string
│     ├─ datetime: timestamp
│     ├─ auditorium: string
│     ├─ language: string
│     ├─ price: number
│     ├─ totalSeats: number
│     ├─ seatsAvailable: number
│     ├─ seatMap: [
│     │   [
│     │     { row: 1, seat: 1, status: "available" },
│     │     { row: 1, seat: 2, status: "taken" },
│     │     { row: 1, seat: 3, status: "handicap" },
│     │     ...
│     │   ],
│     │   [ ... ]
│     │ ]
│     ├─ status: "on_sale" | "cancelled"
│     ├─ createdAt: timestamp
│     └─ updatedAt: timestamp
│
├─ bookings/
│  └─ {bookingId}
│     ├─ userId: string
│     ├─ userName?: string
│     ├─ userEmail?: string
│     ├─ showtimeId: string
│     ├─ movieId: string
│     ├─ movieTitle: string
│     ├─ seats: [
│     │   { row: 2, seat: 4 },
│     │   { row: 2, seat: 5 }
│     │ ]
│     ├─ totalPrice: number
│     ├─ datetime: timestamp
│     ├─ auditorium: string
│     ├─ language: string
│     ├─ status: "pending" | "paid" | "refunded"
│     ├─ createdAt: timestamp
│     ├─ updatedAt: timestamp
│     └─ paidAt?: timestamp
│
└─ users/
   └─ {userId}
      ├─ email: string
      ├─ displayName?: string
      ├─ profileImage?: string
      ├─ favoriteMovies?: string[]
      ├─ bookings?: string[]
      ├─ createdAt: timestamp
      └─ updatedAt: timestamp
```

## 🎨 Component Hierarchy

```
app/admin/page.tsx
│
├─ <AdminGuard>
│  │
│  └─ <AdminPage>
│     │
│     ├─ Tab Navigation
│     │  ├─ Movies
│     │  ├─ Showtimes
│     │  └─ Bookings
│     │
│     ├─ Movies Tab
│     │  ├─ Movie Form
│     │  │  ├─ Text Inputs
│     │  │  ├─ Textareas
│     │  │  ├─ Number Inputs
│     │  │  ├─ Checkbox (Featured)
│     │  │  └─ Submit Button
│     │  │
│     │  └─ Movies List
│     │     └─ Movie Card
│     │        ├─ Poster Image
│     │        ├─ Movie Info
│     │        └─ Action Buttons
│     │           ├─ Edit
│     │           └─ Delete
│     │
│     ├─ Showtimes Tab
│     │  ├─ Showtime Form
│     │  │  ├─ Movie Selector
│     │  │  ├─ DateTime Input
│     │  │  ├─ Auditorium Input
│     │  │  ├─ Language Selector
│     │  │  ├─ Price Input
│     │  │  ├─ Status Selector
│     │  │  │
│     │  │  └─ Seat Map Section
│     │  │     ├─ Grid Configuration
│     │  │     │  ├─ Rows Input
│     │  │     │  ├─ Cols Input
│     │  │     │  └─ Generate Button
│     │  │     │
│     │  │     └─ Visual Seat Editor
│     │  │        └─ Seat Grid
│     │  │           └─ Seat Buttons
│     │  │              ├─ Available (Red)
│     │  │              ├─ Taken (Blue)
│     │  │              └─ Handicap (Icon)
│     │  │
│     │  └─ Showtimes List
│     │     └─ Showtime Card
│     │        ├─ Movie Title
│     │        ├─ DateTime
│     │        ├─ Auditorium
│     │        ├─ Availability
│     │        ├─ Status Badge
│     │        └─ Action Buttons
│     │           ├─ Edit
│     │           └─ Delete
│     │
│     └─ Bookings Tab
│        ├─ Filter Dropdown
│        │  └─ Showtime Filter
│        │
│        └─ Bookings List
│           └─ Booking Card
│              ├─ User Info
│              ├─ Movie Title
│              ├─ Seats List
│              ├─ Total Price
│              ├─ Status Badge
│              └─ Action Buttons
│                 ├─ Mark Paid
│                 └─ Refund
```

## 🔧 File Dependencies

```
app/admin/page.tsx
├─ imports from:
│  ├─ react
│  ├─ firebase/firestore
│  ├─ @/lib/firebase
│  └─ @/components/AdminGuard
│
components/AdminGuard.tsx
├─ imports from:
│  ├─ react
│  ├─ next/navigation
│  └─ firebase/auth
│
lib/adminHelpers.ts
├─ imports from:
│  ├─ firebase/firestore
│  └─ @/lib/firebase
│
lib/bookingIntegration.ts
├─ imports from:
│  ├─ firebase/firestore
│  └─ @/lib/firebase
│
lib/database.ts (existing)
├─ imports from:
│  ├─ firebase/firestore
│  └─ @/lib/firebase
│
lib/firebase.ts (existing)
└─ imports from:
   └─ firebase/app
```

## 🚀 Deployment Checklist

```
Prerequisites
├─ ✓ Firebase project created
├─ ✓ Firestore enabled
├─ ✓ Authentication enabled
└─ ✓ Environment variables set

Setup Steps
├─ 1. Deploy Firestore Rules
│     └─ firebase deploy --only firestore:rules
│
├─ 2. Set Admin Claims
│     └─ node scripts/setupAdmin.js USER_UID
│
├─ 3. Test Locally
│     ├─ npm run dev
│     └─ Visit localhost:3000/admin
│
├─ 4. Verify Security
│     ├─ Try non-admin access
│     └─ Check Firestore rules
│
└─ 5. Deploy to Production
      ├─ vercel deploy (or)
      └─ firebase deploy --only hosting
```

## 📈 Scaling Considerations

```
Current Setup (Small Cinema)
├─ Direct Firestore queries
├─ Client-side state management
└─ Manual seat selection

Future Enhancements (Large Scale)
├─ Firestore indexes for queries
├─ Pagination for large lists
├─ Server-side rendering
├─ Caching layer (Redis)
├─ Background jobs for cleanup
├─ Analytics dashboard
├─ Multi-language support
└─ Advanced seat algorithms
```

---

This architecture provides a solid foundation for managing a cinema with room to grow! 🎬

# Malling Bio Admin Panel

## Overview

This admin panel allows cinema administrators to manage movies, showtimes, seat availability, and bookings for Malling Bio cinema app.

## Features

### 1. Movies Management
- Create, edit, and delete movies
- Fields: title, original title, slug, descriptions, poster URL, trailer URL, genres, runtime, age rating, languages, featured status
- Visual list of all movies with quick edit/delete actions

### 2. Showtimes Management
- Create and edit showtimes linked to movies
- Configure: date/time, auditorium, language, price, status (on sale/cancelled)
- **Seat Map Generator**: Quick setup with customizable rows and seats per row
- **Visual Seat Editor**: Click seats to toggle between:
  - Available (red) - Open for booking
  - Taken (blue) - Already booked
  - Handicap (wheelchair icon) - Handicap accessible
- Real-time seat availability counter
- Last row automatically includes 2 handicap accessible seats

### 3. Bookings Overview
- View all bookings with filtering by showtime
- See customer details, selected seats, total price, and payment status
- Admin actions:
  - Mark pending bookings as paid
  - Issue refunds for paid bookings
- Status indicators: Pending (yellow), Paid (green), Refunded (gray)

## File Structure

```
/app/admin/page.tsx              # Main admin panel component
/lib/adminHelpers.ts             # Helper functions for CRUD operations
/lib/database.ts                 # Existing database service (enhanced)
/lib/firebase.ts                 # Firebase initialization
/firestore.rules                 # Firestore security rules
```

## Setup Instructions

### 1. Firebase Configuration

Make sure your `.env.local` has Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Deploy Firestore Rules

Deploy the security rules to Firebase:

```bash
firebase deploy --only firestore:rules
```

Or manually copy the contents of `firestore.rules` to Firebase Console → Firestore Database → Rules.

### 3. Set Up Admin User

To grant admin access to a user, you need to set custom claims using Firebase Admin SDK.

**Option A: Using Firebase Functions (Recommended)**

Create a Cloud Function:

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

exports.makeAdmin = functions.https.onCall(async (data, context) => {
  // Add your own authentication logic here
  const uid = data.uid;
  
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { message: 'Admin claim set successfully' };
});
```

**Option B: Using Node.js Script**

Create a script file `scripts/makeAdmin.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'USER_UID_HERE'; // Replace with actual user UID

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Admin claim set successfully for user:', uid);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error setting admin claim:', error);
    process.exit(1);
  });
```

Run with: `node scripts/makeAdmin.js`

**Important**: After setting admin claims, the user must sign out and sign back in for changes to take effect.

### 4. Verify Admin Access

In your client code, check if user is admin:

```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;

if (user) {
  const idTokenResult = await user.getIdTokenResult();
  const isAdmin = idTokenResult.claims.admin === true;
  
  if (isAdmin) {
    // Show admin panel
  } else {
    // Redirect to home
  }
}
```

## Usage Guide

### Creating a Movie

1. Go to Admin Panel → Movies tab
2. Fill in the form:
   - **Title**: Display title (e.g., "Wicked: Part II")
   - **Original Title**: Original language title
   - **Slug**: URL-friendly identifier (e.g., "wicked-part-2")
   - **Short Description**: Brief summary (shown in cards)
   - **Long Description**: Full synopsis
   - **Poster URL**: Image URL for poster
   - **Trailer URL**: YouTube or video URL (optional)
   - **Genres**: Comma-separated (e.g., "Fantasy, Musical, Drama")
   - **Runtime**: Duration in minutes
   - **Age Rating**: Age restriction (e.g., "11", "15", "A")
   - **Languages**: Comma-separated (e.g., "Dansk, English")
   - **Featured**: Check to feature on homepage
3. Click "Create Movie"

### Creating a Showtime

1. Go to Admin Panel → Showtimes tab
2. Select a movie from dropdown
3. Choose date and time
4. Set auditorium (e.g., "Sal 1", "Sal 2")
5. Select language version
6. Set ticket price (in DKK)
7. Set status (On Sale or Cancelled)
8. **Generate Seat Map**:
   - Enter number of rows (default: 8)
   - Enter seats per row (default: 12)
   - Click "Generate"
9. **Edit Seats** (optional):
   - Click any seat to toggle its status
   - Red = Available for booking
   - Blue = Already taken/reserved
   - Wheelchair = Handicap accessible
10. Available seat count updates automatically
11. Click "Create Showtime"

### Managing Bookings

1. Go to Admin Panel → Bookings tab
2. Filter by showtime (optional)
3. View all bookings with:
   - Customer name/ID
   - Movie title
   - Selected seats
   - Total price
   - Payment status
4. Actions:
   - **Mark Paid**: Confirm payment for pending bookings
   - **Refund**: Issue refund for paid bookings

## Firestore Collections

### movies
```javascript
{
  title: string,
  originalTitle: string,
  slug: string,
  shortDescription: string,
  longDescription: string,
  posterUrl: string,
  trailerUrl?: string,
  genres: string[],
  runtimeMinutes: number,
  ageRating: string,
  languages: string[],
  featured: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### showtimes
```javascript
{
  movieId: string,              // Reference to movies collection
  datetime: timestamp,
  auditorium: string,
  language: string,
  price: number,
  totalSeats: number,
  seatsAvailable: number,
  seatMap: [                    // 2D array of seat statuses
    [
      { row: 1, seat: 1, status: "available" },
      { row: 1, seat: 2, status: "taken" },
      ...
    ],
    ...
  ],
  status: "on_sale" | "cancelled",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### bookings
```javascript
{
  userId: string,
  userName?: string,
  showtimeId: string,           // Reference to showtimes collection
  movieTitle?: string,
  seats: [
    { row: number, seat: number },
    ...
  ],
  totalPrice: number,
  status: "pending" | "paid" | "refunded",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Security

The admin panel is protected by Firestore security rules that check for `auth.token.admin == true`.

**Rules Summary:**
- Movies, Showtimes, Events: Public read, admin-only write
- Bookings: Users can read their own, admins can modify all
- Users: Users manage their own profile, admins have full access

## Assets Used

Seat icons are located in `/public/assets/`:
- `seat-red.svg` - Available seats
- `seat-white.svg` - Selected/customer seats
- `seat-indigo.svg` - Taken/occupied seats
- `seat-handicap.svg` - Handicap accessible seats

## Styling

The admin panel uses TailwindCSS with Malling Bio's color scheme:
- Primary red: `#B2182B`
- Dark red: `#410C10`, `#670612`
- Background gradient: Black to `#4B0009`
- Accent beige: `#F5E6D3`

## Development

To run the admin panel locally:

```bash
npm run dev
```

Navigate to: `http://localhost:3000/admin`

## Production Considerations

1. **Authentication Guard**: Add a route guard to check admin status before rendering
2. **Error Handling**: Implement toast notifications for better UX
3. **Image Upload**: Replace URL input with actual file upload to Firebase Storage
4. **Validation**: Add form validation (e.g., with Zod or Yup)
5. **Loading States**: Add spinners during async operations
6. **Confirmation Modals**: Use proper modal components for delete confirmations
7. **Pagination**: Implement pagination for large lists
8. **Search**: Add search functionality for movies and showtimes
9. **Audit Logs**: Track admin actions for security

## Troubleshooting

**Problem**: "Permission denied" error
- **Solution**: Ensure user has admin claim set and has signed in again

**Problem**: Seat map not displaying
- **Solution**: Click "Generate" button after setting rows and seats per row

**Problem**: Changes not reflecting immediately
- **Solution**: Check browser console for errors, verify Firebase connection

**Problem**: Can't delete movie with existing showtimes
- **Solution**: Delete or reassign showtimes first (implement cascade delete if needed)

## Support

For issues or questions, check:
- Firebase Console → Firestore Database → Data
- Browser Developer Console (F12)
- Network tab for API errors

## License

Part of Malling Bio cinema application.

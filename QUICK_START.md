# 🚀 Quick Start Guide - Malling Bio Admin Panel

## ⚡ 5-Minute Setup

### Step 1: Verify Firebase Setup
Your Firebase is already configured in `/lib/firebase.ts`. Verify your `.env.local` has:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

### Step 2: Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

Or copy `/firestore.rules` to Firebase Console → Firestore → Rules

### Step 3: Make Yourself Admin

**Quick Method - Firebase Console:**
1. Go to Firebase Console → Authentication → Users
2. Copy your user UID
3. Open Firebase Console → Firestore → Database
4. Create a temporary Cloud Function or use Firebase CLI:

```bash
# Install Firebase CLI globally (if not already)
npm install -g firebase-tools

# Login
firebase login

# Open functions shell
firebase functions:shell

# Set admin claim (replace with your UID)
admin.auth().setCustomUserClaims('YOUR_USER_UID', { admin: true })
```

**Alternative - Node.js Script:**
1. Download service account key from Firebase Console (Project Settings → Service Accounts)
2. Save as `serviceAccountKey.json` in project root
3. Add to `.gitignore`
4. Run: `node scripts/setupAdmin.js YOUR_USER_UID`

### Step 4: Sign Out and Back In
**Important**: Changes take effect after signing out and back in!

```javascript
// In your app or browser console
import { getAuth, signOut } from 'firebase/auth';
const auth = getAuth();
await signOut(auth);
// Then sign in again
```

### Step 5: Access Admin Panel
Navigate to: `http://localhost:3000/admin`

---

## 📝 Your First Movie

1. Go to **Movies** tab
2. Fill in the form:
   ```
   Title: Wicked: Part II
   Original Title: Wicked: Part Two
   Slug: wicked-part-2
   Short Description: The epic conclusion to the Broadway adaptation
   Long Description: [Full synopsis]
   Poster URL: https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg
   Genres: Fantasy, Musical, Drama
   Runtime: 150
   Age Rating: 11
   Languages: English, Dansk
   Featured: ✓
   ```
3. Click **Create Movie**
4. Movie appears in the list on the right

---

## 🎬 Your First Showtime

1. Go to **Showtimes** tab
2. Select the movie you just created
3. Choose date and time (e.g., tomorrow at 19:00)
4. Set:
   ```
   Auditorium: Sal 1
   Language: Eng. tale
   Price: 100
   Status: On Sale
   ```
5. Generate seat map:
   ```
   Rows: 8
   Seats per row: 12
   Click "Generate"
   ```
6. **Optional**: Click seats to toggle status
   - Red = Available
   - Blue = Taken
   - Wheelchair = Handicap
7. Click **Create Showtime**

---

## 📋 View Bookings

1. Go to **Bookings** tab
2. Filter by showtime (optional)
3. See all customer bookings
4. Actions:
   - **Mark Paid**: For pending bookings
   - **Refund**: For paid bookings

---

## 🔗 Integration with Customer Flow

### Update DetailFoldElement to Use Real Data

Currently, your `DetailFoldElement.tsx` uses hardcoded data. To integrate:

```typescript
// 1. Import helpers
import { getAvailableShowtimes } from '@/lib/bookingIntegration';

// 2. Load showtimes on mount
useEffect(() => {
  async function loadShowtimes() {
    const showtimes = await getAvailableShowtimes(movieId);
    setShowtimesList(showtimes);
  }
  loadShowtimes();
}, [movieId]);

// 3. Use real seat map from showtime
const showtimeData = showtimes.find(s => s.id === selectedShowtimeId);
if (showtimeData) {
  setSeatMap(showtimeData.seatMap);
}
```

### Update Payment Page

```typescript
// app/payment/page.tsx
import { handlePaymentSuccess } from '@/lib/bookingIntegration';
import { auth } from '@/lib/firebase';

async function processPayment() {
  const user = auth.currentUser;
  if (!user) throw new Error('Please sign in');
  
  const bookingId = await handlePaymentSuccess(
    user.uid,
    user.displayName || 'Guest',
    user.email || '',
    selectedShowtimeId,
    movieId,
    movieTitle,
    selectedSeats,
    showDateTime,
    auditorium,
    language,
    pricePerSeat
  );
  
  router.push(`/ticket/${bookingId}`);
}
```

---

## ✅ Verify Everything Works

### Test Admin Functions
- [ ] Create a test movie
- [ ] Edit the movie (change title)
- [ ] Create showtime for that movie
- [ ] Generate seat map (8x12)
- [ ] Toggle some seats to "taken"
- [ ] Save showtime
- [ ] Check showtimes list

### Test Security
- [ ] Sign out
- [ ] Try to access `/admin` → Should redirect
- [ ] Sign in as non-admin → Should redirect
- [ ] Sign in as admin → Should show admin panel

### Test Bookings (Optional)
- [ ] Use customer flow to book seats
- [ ] Check booking appears in admin panel
- [ ] Mark booking as paid
- [ ] Issue refund

---

## 🎨 Customize

### Change Colors
Edit in `/app/admin/page.tsx`:
```typescript
// Primary red
className="bg-[#B2182B]" → className="bg-[#YOUR_COLOR]"

// Dark backgrounds
className="bg-[#410C10]" → className="bg-[#YOUR_COLOR]"
```

### Add More Fields
In `MovieInput` interface (`/lib/adminHelpers.ts`):
```typescript
export interface MovieInput {
  // Existing fields...
  director?: string;  // Add new field
  actors?: string[];  // Add new field
}
```

Then update the form in admin page.

### Custom Seat Layout
Edit `generateDefaultSeatMap()` in `/lib/adminHelpers.ts`:
```typescript
// Example: Row 3 has gap (aisle)
if (row === 2) {
  // Skip row 3
  continue;
}
```

---

## 🐛 Common Issues

### "Permission Denied" when creating movie
**Solution**: 
1. Check admin claim: `await user.getIdTokenResult()`
2. Verify Firestore rules deployed
3. Sign out and back in

### Seat map not showing
**Solution**:
1. Click "Generate" button first
2. Check browser console for errors
3. Verify `/public/assets/seat-*.svg` files exist

### Bookings not updating
**Solution**:
1. Check Firestore rules allow bookings collection
2. Verify showtime ID is correct
3. Check browser network tab for errors

### Admin page keeps redirecting
**Solution**:
1. Verify you're signed in
2. Check admin claim is set
3. Look at browser console for auth errors

---

## 📚 Next Steps

1. **Add More Movies**: Build your movie catalog
2. **Create Showtimes**: Set up screening schedule
3. **Test Booking Flow**: Book tickets as customer
4. **Monitor Bookings**: Track revenue in admin panel
5. **Production Deploy**: Deploy to Vercel/Firebase Hosting

---

## 💡 Pro Tips

- Use **Featured** checkbox for homepage spotlight movies
- Set some seats as "taken" to show availability
- Use **Cancelled** status for cancelled showtimes
- Filter bookings by showtime to see specific show performance
- Check seat availability counter when editing seat map

---

## 🆘 Need Help?

1. **Check documentation**: Read `ADMIN_README.md`
2. **View implementation**: See `ADMIN_IMPLEMENTATION_SUMMARY.md`
3. **Browser console**: Press F12, check for errors
4. **Firebase Console**: Check Firestore data directly
5. **Network tab**: See failed requests

---

## 🎉 You're Ready!

Your admin panel is set up and ready to use. Start by creating your first movie and showtime!

**Admin URL**: `http://localhost:3000/admin`

Happy administrating! 🎬🍿

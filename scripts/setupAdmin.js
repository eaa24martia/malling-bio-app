/**
 * Admin User Setup Script
 * 
 * This script should be run in a secure Node.js environment (NOT in browser).
 * It uses Firebase Admin SDK to set custom claims for admin users.
 * 
 * Prerequisites:
 * 1. Install Firebase Admin SDK: npm install firebase-admin
 * 2. Download service account key from Firebase Console:
 *    Project Settings > Service Accounts > Generate New Private Key
 * 3. Save the key as serviceAccountKey.json in the project root
 * 4. Add serviceAccountKey.json to .gitignore
 * 
 * Usage:
 * node scripts/setupAdmin.js USER_UID
 */

// Uncomment and use this code in a Node.js environment with Firebase Admin SDK

/*
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim(uid) {
  try {
    // Set custom claim
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    
    // Verify the claim was set
    const user = await admin.auth().getUser(uid);
    console.log('✅ Admin claim set successfully!');
    console.log('User:', user.email || user.uid);
    console.log('Custom claims:', user.customClaims);
    console.log('\n⚠️  Important: User must sign out and sign back in for changes to take effect.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting admin claim:', error);
    process.exit(1);
  }
}

// Get UID from command line argument
const uid = process.argv[2];

if (!uid) {
  console.error('❌ Please provide a user UID as argument');
  console.log('Usage: node scripts/setupAdmin.js USER_UID');
  process.exit(1);
}

setAdminClaim(uid);
*/

// Alternative: Firebase Cloud Function approach
// Deploy this as a callable function for more security

/*
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Verify the caller is an existing admin (or use another auth method)
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set admin claims'
    );
  }
  
  const { uid } = data;
  
  if (!uid) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'User UID is required'
    );
  }
  
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return { 
      success: true, 
      message: `Admin claim set for user ${uid}` 
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Remove admin claim
exports.removeAdminClaim = functions.https.onCall(async (data, context) => {
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can remove admin claims'
    );
  }
  
  const { uid } = data;
  
  if (!uid) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'User UID is required'
    );
  }
  
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: false });
    return { 
      success: true, 
      message: `Admin claim removed for user ${uid}` 
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
*/

export const setupInstructions = `
ADMIN SETUP INSTRUCTIONS
========================

Option 1: Node.js Script (Quickest)
------------------------------------
1. Install Firebase Admin SDK:
   npm install firebase-admin

2. Get service account key:
   - Go to Firebase Console
   - Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save as serviceAccountKey.json in project root
   - Add to .gitignore!

3. Create scripts/setupAdmin.js with the code from this file

4. Run:
   node scripts/setupAdmin.js YOUR_USER_UID

5. User must sign out and back in

Option 2: Firebase CLI (Interactive)
-------------------------------------
1. Install Firebase CLI:
   npm install -g firebase-tools

2. Login:
   firebase login

3. Initialize project:
   firebase init

4. Use Functions shell:
   firebase functions:shell
   > admin.auth().setCustomUserClaims('USER_UID', { admin: true })

5. User must sign out and back in

Option 3: Cloud Function (Most Secure)
---------------------------------------
1. Create a Cloud Function (see commented code above)

2. Deploy:
   firebase deploy --only functions

3. Call from admin page:
   const makeAdmin = httpsCallable(functions, 'setAdminClaim');
   await makeAdmin({ uid: 'USER_UID' });

4. User must sign out and back in

Verification
------------
Check if user has admin claim in your app:

const idTokenResult = await auth.currentUser?.getIdTokenResult();
const isAdmin = idTokenResult?.claims?.admin === true;

Finding User UID
----------------
1. Firebase Console > Authentication > Users
2. Click on user to see UID
3. Or get from auth.currentUser.uid in your app
`;

console.log(setupInstructions);

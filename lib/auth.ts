import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const signUpUser = async ({ name, email, password }: SignupData): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name
    });

    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
      uid: user.uid
    });

    return user;
  } catch (error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('Denne e-mail adresse er allerede i brug');
      case 'auth/invalid-email':
        throw new Error('Ugyldig e-mail adresse');
      case 'auth/weak-password':
        throw new Error('Adgangskoden er for svag. Vælg en stærkere adgangskode');
      default:
        throw new Error('Der opstod en fejl ved oprettelse af bruger');
    }
  }
};

export const signInUser = async ({ email, password }: LoginData): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('Der findes ingen bruger med denne e-mail');
      case 'auth/wrong-password':
        throw new Error('Forkert adgangskode');
      case 'auth/invalid-email':
        throw new Error('Ugyldig e-mail adresse');
      case 'auth/too-many-requests':
        throw new Error('For mange fejlslagne forsøg. Prøv igen senere');
      default:
        throw new Error('Der opstod en fejl ved login');
    }
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('Der opstod en fejl ved log ud');
  }
};

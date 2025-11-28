
'use client';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';
import { useAuth, useFirestore } from '.';

export function useFirebaseAuth() {
  const auth = useAuth();
  const firestore = useFirestore();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await createUserProfile(result.user);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // When signing up with email, there is no display name by default.
    // We can extract it from the email for a better default user experience.
    const name = email.split('@')[0];
    await updateProfile(result.user, { displayName: name });
    await createUserProfile(result.user, { name, email });
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }

  const createUserProfile = async (user: User, additionalData: any = {}) => {
    if (!user) return;
    const userRef = doc(firestore, `users/${user.uid}`);
    const userProfile: { [key: string]: any } = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      ...additionalData,
    };

    // Make sure to remove undefined/null values to not overwrite existing data with null
    Object.keys(userProfile).forEach(key => {
      if (userProfile[key] === undefined || userProfile[key] === null) {
        delete userProfile[key];
      }
    });
    
    setDocumentNonBlocking(userRef, userProfile, { merge: true });
  };

  return { signInWithGoogle, signOut, signUpWithEmail, signInWithEmail, sendPasswordResetEmail: sendPasswordReset };
}

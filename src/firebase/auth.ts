'use client';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
    await createUserProfile(result.user, {email});
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const createUserProfile = async (user: User, additionalData: any = {}) => {
    if (!user) return;
    const userRef = doc(firestore, `users/${user.uid}`);
    const userProfile = {
      id: user.uid,
      name: user.displayName || additionalData.name,
      email: user.email,
      photoURL: user.photoURL,
      ...additionalData
    };
    // Make sure to remove undefined values
    Object.keys(userProfile).forEach(key => userProfile[key as keyof typeof userProfile] === undefined && delete userProfile[key as keyof typeof userProfile]);
    setDocumentNonBlocking(userRef, userProfile, { merge: true });
  };

  return { signInWithGoogle, signOut, signUpWithEmail, signInWithEmail };
}

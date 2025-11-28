
'use client';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
    const name = email.split('@')[0];
    // We need to update the auth profile first to get a display name
    await updateProfile(result.user, { displayName: name });
    // Then create the firestore document with the correct name
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
    if (!user || !firestore) return;
    const userRef = doc(firestore, `users/${user.uid}`);
    const userProfile: { [key: string]: any } = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      ...additionalData,
    };

    // Remove any null or undefined fields to keep the document clean
    Object.keys(userProfile).forEach(key => {
      if (userProfile[key] === undefined || userProfile[key] === null) {
        delete userProfile[key];
      }
    });
    
    await setDoc(userRef, userProfile, { merge: true });
  };

  return { 
    auth,
    signInWithGoogle, 
    signOut, 
    signUpWithEmail, 
    signInWithEmail, 
    sendPasswordResetEmail: sendPasswordReset,
   };
}

    
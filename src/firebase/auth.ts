
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
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '.';

// Helper to convert file to data URI
const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });


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

  const updateUserPassword = async (newPassword: string) => {
    if (!auth.currentUser) {
        throw new Error("Utilisateur non authentifié.");
    }
    await updatePassword(auth.currentUser, newPassword);
  }

  const updateUserProfile = async (displayName?: string, photoFile?: File | null) => {
    if (!auth.currentUser || !firestore) {
        throw new Error("Utilisateur non authentifié ou service Firestore non disponible.");
    }

    const currentUser = auth.currentUser;
    const authProfileUpdates: { displayName?: string } = {};
    const firestoreUpdates: { name?: string, photoURL?: string } = {};

    // Prepare Auth update only for display name
    if (displayName && displayName !== currentUser.displayName) {
        authProfileUpdates.displayName = displayName;
        firestoreUpdates.name = displayName;
    }
    
    // Prepare Firestore update for photo
    if (photoFile) {
        firestoreUpdates.photoURL = await toDataURL(photoFile);
    }
    
    // 1. Update Firebase Auth profile (only with displayName)
    if (Object.keys(authProfileUpdates).length > 0) {
        await updateProfile(currentUser, authProfileUpdates);
    }
    
    // 2. Update Firestore user document with all changes (name and/or photo)
    const userRef = doc(firestore, `users/${currentUser.uid}`);
    if (Object.keys(firestoreUpdates).length > 0) {
        await setDoc(userRef, firestoreUpdates, { merge: true });
    }
  };
  
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
    signInWithGoogle, 
    signOut, 
    signUpWithEmail, 
    signInWithEmail, 
    sendPasswordResetEmail: sendPasswordReset,
    updateUserProfile,
    updateUserPassword,
   };
}

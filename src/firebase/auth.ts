
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

    let photoURL: string | undefined = auth.currentUser.photoURL ?? undefined;
    if (photoFile) {
        photoURL = await toDataURL(photoFile);
    }

    const profileUpdates: { displayName?: string, photoURL?: string } = {};
    if (displayName) profileUpdates.displayName = displayName;
    if (photoURL) profileUpdates.photoURL = photoURL;
    
    // Update Firebase Auth profile
    await updateProfile(auth.currentUser, profileUpdates);
    
    // Update Firestore user document
    const userRef = doc(firestore, `users/${auth.currentUser.uid}`);
    const dataToUpdate = { ...profileUpdates };
    // remove undefined values
    Object.keys(dataToUpdate).forEach(key => (dataToUpdate as any)[key] === undefined && delete (dataToUpdate as any)[key]);
    
    await setDoc(userRef, dataToUpdate, { merge: true });
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

'use client';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';
import { useAuth, useFirestore } from '.';

export function useFirebaseAuth() {
  const auth = useAuth();
  const firestore = useFirestore();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google:", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const createUserProfile = async (user: User) => {
    if (!user) return;
    const userRef = doc(firestore, `users/${user.uid}`);
    const userProfile = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
    setDocumentNonBlocking(userRef, userProfile, { merge: true });
  };

  return { signInWithGoogle, signOut };
}

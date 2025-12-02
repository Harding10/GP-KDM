
'use client';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useAuth, useFirestore } from '.';

export function useFirebaseAuth() {
  const auth = useAuth();
  const firestore = useFirestore();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // Détection mobile ou PWA standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const isMobile = window.innerWidth < 768;
    if (isStandalone || isMobile) {
      // Par défaut Firebase utilise sessionStorage pour stocker l'état de redirection.
      // Sur certains navigateurs mobiles, sessionStorage peut être inaccessible
      // ou effacé pendant la redirection. On préfère utiliser localStorage
      // quand c'est possible, avec un fallback vers inMemory.
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (e) {
        // Si localStorage est indisponible (ex: mode privé iOS), fallback
        try {
          await setPersistence(auth, inMemoryPersistence);
        } catch (err) {
          // Rien à faire, on continue avec la persistence par défaut
        }
      }
      await signInWithRedirect(auth, provider);
      // Le résultat sera traité après redirection
    } else {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
    }
  };

  // Gérer le résultat de la redirection Google après retour
  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          await createUserProfile(result.user);
        }
      } catch (e) {
        // Optionnel : gérer l'erreur
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        // Document exists, perform an update
        await updateDoc(userRef, userProfile);
    } else {
        // Document doesn't exist, create it
        await setDoc(userRef, userProfile);
    }
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

"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const AuthContext = createContext({
  user: null,
  loading: true,
  loginWithEmail: async () => {},
  signUpWithEmail: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  isMock: false
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if running in Simulator Mode (missing or dummy API key configuration)
  const isMockMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'dummy-api-key';

  useEffect(() => {
    if (isMockMode) {
      console.log('[Sukhira Auth] Running in Local Simulator Auth Mode.');
      // Local fallback: retrieve active session from localStorage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('sukhira_mock_user');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch (e) {
            setUser(null);
          }
        }
      }
      setLoading(false);
      return;
    }

    // Live Firebase Auth mode
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      }, (err) => {
        console.error('[Firebase Auth client error]:', err.message);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error('[Firebase Client initialization error]:', err.message);
      setLoading(false);
    }
  }, [isMockMode]);

  const loginWithEmail = async (email, password) => {
    if (isMockMode) {
      console.log('[Auth Simulator] Mock login with email:', email);
      const mockUser = {
        uid: 'mock_customer_123',
        email: email.toLowerCase(),
        displayName: email.split('@')[0],
        emailVerified: true
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sukhira_mock_user', JSON.stringify(mockUser));
      }
      setUser(mockUser);
      return { user: mockUser };
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email, password, displayName) => {
    if (isMockMode) {
      console.log('[Auth Simulator] Mock registration:', email, displayName);
      const mockUser = {
        uid: `mock_${Date.now()}`,
        email: email.toLowerCase(),
        displayName: displayName || email.split('@')[0],
        emailVerified: true
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sukhira_mock_user', JSON.stringify(mockUser));
      }
      setUser(mockUser);
      return { user: mockUser };
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return cred;
  };

  const loginWithGoogle = async () => {
    if (isMockMode) {
      console.log('[Auth Simulator] Mock Google Sign-In popup');
      const mockUser = {
        uid: 'mock_google_customer_99',
        email: 'google.partner@gmail.com',
        displayName: 'Google Partner User',
        emailVerified: true
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sukhira_mock_user', JSON.stringify(mockUser));
      }
      setUser(mockUser);
      return { user: mockUser };
    }
    return signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    if (isMockMode) {
      console.log('[Auth Simulator] Mock Logout');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sukhira_mock_user');
      }
      setUser(null);
      return;
    }
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, signUpWithEmail, loginWithGoogle, logout, isMock: isMockMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

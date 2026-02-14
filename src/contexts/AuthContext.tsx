import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { saveData, loadData, removeData, KEYS } from '../services/storage';
import * as Crypto from 'expo-crypto';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, displayName: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const stored = await loadData<User>(KEYS.USER);
      if (stored) {
        setUser(stored);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    try {
      // Local authentication - stores user data locally
      const id = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        email + password
      );
      const newUser: User = {
        id: id.slice(0, 16),
        email,
        displayName: email.split('@')[0],
        photoUrl: `https://i.pravatar.cc/150?u=${email}`,
        createdAt: Date.now(),
      };
      await saveData(KEYS.USER, newUser);
      setUser(newUser);
      return true;
    } catch (e) {
      console.error('Sign in error:', e);
      return false;
    }
  }

  async function signUp(email: string, password: string, displayName: string): Promise<boolean> {
    try {
      const id = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        email + Date.now().toString()
      );
      const newUser: User = {
        id: id.slice(0, 16),
        email,
        displayName,
        photoUrl: `https://i.pravatar.cc/150?u=${email}`,
        createdAt: Date.now(),
      };
      await saveData(KEYS.USER, newUser);
      setUser(newUser);
      return true;
    } catch (e) {
      console.error('Sign up error:', e);
      return false;
    }
  }

  async function signInWithGoogle(): Promise<boolean> {
    try {
      // Simulated Google sign-in for demo
      const newUser: User = {
        id: 'google-' + Date.now().toString(36),
        email: 'user@gmail.com',
        displayName: 'Usuário Google',
        photoUrl: 'https://i.pravatar.cc/150?u=google',
        createdAt: Date.now(),
      };
      await saveData(KEYS.USER, newUser);
      setUser(newUser);
      return true;
    } catch (e) {
      console.error('Google sign in error:', e);
      return false;
    }
  }

  async function signOut(): Promise<void> {
    await removeData(KEYS.USER);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

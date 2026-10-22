import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'simpandadu_auth_user';
const PASSWORDS_STORAGE_KEY = 'simpandadu_user_passwords';

const DEFAULT_PASSWORDS: Record<string, string> = {
  admin: 'admin123',
  sekdes: 'sekdes123',
  kaurkeu: 'kaurkeu123',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize passwords store if not present
  useEffect(() => {
    try {
      const storedPass = localStorage.getItem(PASSWORDS_STORAGE_KEY);
      if (!storedPass) {
        localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(DEFAULT_PASSWORDS));
      }

      // Check active session from localStorage or sessionStorage
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    usernameOrEmail: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; message: string }> => {
    // Artificial slight delay for authentic network validation experience
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanInput = usernameOrEmail.trim().toLowerCase();
    const matchedUser = INITIAL_USERS.find(
      (u) => u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput
    );

    if (!matchedUser) {
      return {
        success: false,
        message: 'Username atau Email tidak ditemukan dalam sistem.',
      };
    }

    // Check password
    let storedPass: Record<string, string> = DEFAULT_PASSWORDS;
    try {
      const passData = localStorage.getItem(PASSWORDS_STORAGE_KEY);
      if (passData) {
        storedPass = JSON.parse(passData);
      }
    } catch {
      storedPass = DEFAULT_PASSWORDS;
    }

    const expectedPass = storedPass[matchedUser.username] || 'admin123';
    if (password !== expectedPass) {
      return {
        success: false,
        message: 'Kata sandi yang Anda masukkan salah. Silakan periksa kembali.',
      };
    }

    const now = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    const sessionUser: User = {
      ...matchedUser,
      lastLogin: now,
    };

    setCurrentUser(sessionUser);

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    return {
      success: true,
      message: `Selamat datang, ${sessionUser.name}!`,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);

    if (localStorage.getItem(AUTH_STORAGE_KEY)) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Tidak ada sesi aktif.' };

    let storedPass: Record<string, string> = DEFAULT_PASSWORDS;
    try {
      const passData = localStorage.getItem(PASSWORDS_STORAGE_KEY);
      if (passData) storedPass = JSON.parse(passData);
    } catch {
      storedPass = DEFAULT_PASSWORDS;
    }

    const expectedPass = storedPass[currentUser.username] || 'admin123';
    if (oldPassword !== expectedPass) {
      return { success: false, message: 'Kata sandi lama tidak cocok.' };
    }

    if (newPassword.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal 6 karakter.' };
    }

    storedPass[currentUser.username] = newPassword;
    localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(storedPass));

    return { success: true, message: 'Kata sandi berhasil diperbarui!' };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

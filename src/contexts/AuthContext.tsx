import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/data';
import { usersApi } from '@/lib/api';

interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      loadUser(parseInt(storedUserId));
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async (userId: number) => {
    try {
      const user = await usersApi.getById(userId);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setIsAdmin(user.user_role === 'Admin');
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('currentUserId');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await usersApi.login(email, password);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setIsAdmin(user.user_role === 'Admin');
      localStorage.setItem('currentUserId', user.user_id.toString());
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('currentUserId');
  };

  const updateUser = async (updatedUser: User) => {
    try {
      await usersApi.update(updatedUser.user_id, updatedUser);
      setCurrentUser(updatedUser);
      setIsAdmin(updatedUser.user_role === 'Admin');
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, isAdmin, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
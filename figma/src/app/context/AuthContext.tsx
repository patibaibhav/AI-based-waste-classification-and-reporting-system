import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'user' | 'admin' | null;
  userName: string | null;
  userEmail: string | null;
  login: (type: 'user' | 'admin', name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'user' | 'admin' | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const { isAuthenticated, userType, userName, userEmail } = JSON.parse(storedAuth);
      setIsAuthenticated(isAuthenticated);
      setUserType(userType);
      setUserName(userName);
      setUserEmail(userEmail);
    }
  }, []);

  const login = (type: 'user' | 'admin', name: string, email: string) => {
    setIsAuthenticated(true);
    setUserType(type);
    setUserName(name);
    setUserEmail(email);
    localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, userType: type, userName: name, userEmail: email }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setUserName(null);
    setUserEmail(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, userName, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

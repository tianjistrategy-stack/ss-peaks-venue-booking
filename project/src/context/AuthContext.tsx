import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  role: 'admin';
  loginTime: Date;
}

interface AuthContextType {
  user: User | null;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'SS2025Admin!'; // 在真實應用中應該從環境變數讀取

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 檢查本地存儲中的登入狀態
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // 檢查登入是否在24小時內
      const loginTime = new Date(parsed.loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        setUser({
          ...parsed,
          loginTime: new Date(parsed.loginTime)
        });
      } else {
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const newUser: User = {
        id: 'admin',
        role: 'admin',
        loginTime: new Date()
      };
      setUser(newUser);
      localStorage.setItem('adminUser', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
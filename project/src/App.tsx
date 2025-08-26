import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import VenueBooking from './components/VenueBooking';
import AdminLogin from './components/AdminLogin';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from './components/ui/Toaster';
import './index.css';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // 檢查系統主題偏好
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <Router>
            <div className={`min-h-screen bg-white ${theme}`}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/venue/:venueId" element={<VenueBooking />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
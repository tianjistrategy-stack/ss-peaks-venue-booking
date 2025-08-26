# SS Peaks Group 完整場地預約系統

**版本：** v2.0  
**更新日期：** 2025-01-27  
**專案負責人：** SS Peaks Group 技術團隊  

---

## 專案概述

SS Peaks Group 場地預約系統是一個現代化的網頁應用程式，專為管理三個專業場地的預約而設計：東門錄音室（大）、東門錄音室（小）和古亭練習室。系統採用 React + TypeScript 技術棧，提供直觀的用戶界面、完整的預約管理功能和專業級的管理員系統。

### 核心特色
- 🏢 三個專業場地的完整預約管理
- 📅 Google 日曆級的月曆功能（月/週/日/議程視圖）
- 🔐 安全的管理員權限系統
- 📱 響應式設計，完美適配各種設備
- 🌍 多語言支援（繁體中文/英文）
- ⚡ 即時預約狀態更新和衝突檢測
- 📊 完整的資料匯出和分析功能

---

## 技術架構

### 技術棧
- **前端框架：** React 18 + TypeScript
- **樣式系統：** Tailwind CSS
- **狀態管理：** React Context API
- **路由管理：** React Router DOM
- **日期處理：** date-fns
- **圖標系統：** Lucide React
- **建構工具：** Vite
- **資料存儲：** Browser localStorage（可升級至資料庫）

### 專案結構
```
src/
├── components/           # React 組件
│   ├── ui/              # 通用 UI 組件
│   ├── HomePage.tsx     # 主頁面
│   ├── VenueBooking.tsx # 場地預約頁面
│   ├── BookingForm.tsx  # 預約表單
│   ├── CalendarView.tsx # 日曆視圖
│   ├── AdminPanel.tsx   # 管理員面板
│   └── ...
├── context/             # React Context
│   ├── AuthContext.tsx  # 認證狀態
│   ├── BookingContext.tsx # 預約資料
│   └── LanguageContext.tsx # 多語言
├── config/              # 配置文件
│   └── venues.ts        # 場地配置
└── utils/               # 工具函數
    └── toast.ts         # 通知系統
```

---

## 完整源代碼

### 主應用程式 (src/App.tsx)

```tsx
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
```

### 主頁面 (src/components/HomePage.tsx)

```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Mic2, FenceIcon as Dancing, UserCheck, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageToggle from './ui/LanguageToggle';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  const venues = [
    {
      id: 'dongmen-large',
      nameKey: 'venues.dongmenLarge.name',
      descriptionKey: 'venues.dongmenLarge.description',
      image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Music,
      gradient: 'from-red-500/20 to-pink-500/20',
      adminOnly: true
    },
    {
      id: 'dongmen-small',
      nameKey: 'venues.dongmenSmall.name',
      descriptionKey: 'venues.dongmenSmall.description',
      image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Mic2,
      gradient: 'from-orange-500/20 to-red-500/20',
      adminOnly: true
    },
    {
      id: 'guting-practice',
      nameKey: 'venues.gutingPractice.name',
      descriptionKey: 'venues.gutingPractice.description',
      image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Dancing,
      gradient: 'from-purple-500/20 to-indigo-500/20',
      adminOnly: false
    }
  ];

  const handleVenueClick = (venueId: string, adminOnly: boolean) => {
    if (adminOnly && !user) {
      navigate('/admin', { state: { redirectTo: `/venue/${venueId}` } });
    } else {
      navigate(`/venue/${venueId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SS Peaks Group</h1>
                <p className="text-sm text-gray-600">{t('common.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              {!user && (
                <button
                  onClick={() => navigate('/admin')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  {t('admin.login')}
                </button>
              )}
              {user && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">{t('admin.loggedIn')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('home.hero.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.hero.description')}
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => {
            const Icon = venue.icon;
            const isAccessible = !venue.adminOnly || user;
            
            return (
              <div
                key={venue.id}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  !isAccessible ? 'opacity-75' : 'hover:scale-105'
                }`}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={venue.image}
                    alt={t(venue.nameKey)}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${venue.gradient} to-transparent`}>
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {venue.adminOnly && !user && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-red-500/90 backdrop-blur-sm rounded-lg px-3 py-2">
                          <p className="text-white text-sm font-medium flex items-center">
                            <UserCheck className="w-4 h-4 mr-2" />
                            {t('common.adminRequired')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t(venue.nameKey)}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t(venue.descriptionKey)}
                  </p>
                  <button
                    onClick={() => handleVenueClick(venue.id, venue.adminOnly)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isAccessible
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!isAccessible}
                  >
                    {isAccessible ? t('common.bookNow') : t('admin.loginRequired')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            {t('home.features.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-red-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t('home.features.professional.title')}
              </h4>
              <p className="text-gray-600">
                {t('home.features.professional.description')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-red-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t('home.features.available.title')}
              </h4>
              <p className="text-gray-600">
                {t('home.features.available.description')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-red-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t('home.features.management.title')}
              </h4>
              <p className="text-gray-600">
                {t('home.features.management.description')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
```

### 場地預約頁面 (src/components/VenueBooking.tsx)

```tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, FileText, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import BookingForm from './BookingForm';
import CalendarView from './CalendarView';
import AdminPanel from './AdminPanel';
import VenueRules from './VenueRules';
import { venueConfigs } from '../config/venues';
import LanguageToggle from './ui/LanguageToggle';

const VenueBooking = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { bookings } = useBooking();
  const [currentView, setCurrentView] = useState<'booking' | 'calendar' | 'admin' | 'rules'>('booking');
  
  const venue = venueConfigs[venueId as keyof typeof venueConfigs];

  useEffect(() => {
    if (!venue) {
      navigate('/');
    } else if (venue.adminOnly && !user) {
      navigate('/admin', { state: { redirectTo: `/venue/${venueId}` } });
    }
  }, [venue, user, navigate, venueId]);

  if (!venue) return null;

  const venueBookings = bookings.filter(b => b.venueId === venueId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-red-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {t(venue.nameKey)}
                </h1>
                <p className="text-sm text-gray-600">
                  {t(venue.descriptionKey)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">
                      {t('admin.loggedIn')}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {t('admin.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setCurrentView('booking')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'booking'
                ? 'bg-red-500 text-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t('nav.booking')}
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'calendar'
                ? 'bg-red-500 text-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-4 h-4 mr-2" />
            {t('nav.calendar')}
          </button>
          {venue.id === 'guting-practice' && (
            <button
              onClick={() => setCurrentView('rules')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'rules'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              {t('nav.rules')}
            </button>
          )}
          {user && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'admin'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              {t('nav.admin')}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'booking' && <BookingForm venueId={venueId!} />}
        {currentView === 'calendar' && <CalendarView venueId={venueId!} />}
        {currentView === 'rules' && venue.id === 'guting-practice' && <VenueRules />}
        {currentView === 'admin' && user && <AdminPanel venueId={venueId!} />}
      </main>
    </div>
  );
};

export default VenueBooking;
```

### 預約表單 (src/components/BookingForm.tsx)

```tsx
import React, { useState } from 'react';
import { Calendar, Clock, User, Building, Target, Phone, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { venueConfigs } from '../config/venues';
import TimeSlotSelector from './TimeSlotSelector';
import { toast } from '../utils/toast';
import { format, addDays, startOfToday } from 'date-fns';

interface BookingFormProps {
  venueId: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ venueId }) => {
  const { t } = useLanguage();
  const { addBooking, bookings } = useBooking();
  const venue = venueConfigs[venueId as keyof typeof venueConfigs];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    purpose: '',
    date: format(startOfToday(), 'yyyy-MM-dd'),
    timeSlots: [] as string[],
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.phoneRequired');
    } else if (!/^[0-9\-\s\+\(\)]{8,}$/.test(formData.phone)) {
      newErrors.phone = t('validation.phoneInvalid');
    }

    if (!formData.company) {
      newErrors.company = t('validation.companyRequired');
    }

    if (!formData.purpose) {
      newErrors.purpose = t('validation.purposeRequired');
    }

    if (formData.timeSlots.length === 0) {
      newErrors.timeSlots = t('validation.timeSlotsRequired');
    } else if (formData.timeSlots.length > venue.maxSlots) {
      newErrors.timeSlots = t('validation.maxSlots', { max: venue.maxSlots });
    }

    // 檢查時段衝突
    const existingBookings = bookings.filter(
      b => b.venueId === venueId && b.date === formData.date && b.status === 'confirmed'
    );
    
    const conflictSlots = formData.timeSlots.filter(slot =>
      existingBookings.some(booking => booking.timeSlots.includes(slot))
    );

    if (conflictSlots.length > 0) {
      newErrors.timeSlots = t('validation.slotConflict', { slots: conflictSlots.join(', ') });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬 API 請求

      const booking = {
        id: Date.now().toString(),
        venueId,
        ...formData,
        status: 'confirmed' as const,
        createdAt: new Date(),
        confirmationCode: Math.random().toString(36).substring(2, 15)
      };

      addBooking(booking);

      toast.success(t('booking.success.title'));

      // 重置表單
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        purpose: '',
        date: format(startOfToday(), 'yyyy-MM-dd'),
        timeSlots: [],
        notes: ''
      });

    } catch (error) {
      toast.error(t('booking.error.title'), {
        description: t('booking.error.description')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold mb-2">{t('booking.form.title')}</h2>
          <p className="text-red-100">{t('booking.form.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                {t('booking.form.name')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={t('booking.form.namePlaceholder')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                {t('booking.form.phone')} *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={t('booking.form.phonePlaceholder')}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('booking.form.email')} *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={t('booking.form.emailPlaceholder')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                {t('booking.form.company')} *
              </label>
              <select
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                  errors.company ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">{t('booking.form.selectCompany')}</option>
                {venue.companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
              {errors.company && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.company}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                {t('booking.form.purpose')} *
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                  errors.purpose ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">{t('booking.form.selectPurpose')}</option>
                {venue.purposes.map(purpose => (
                  <option key={purpose} value={purpose}>{purpose}</option>
                ))}
              </select>
              {errors.purpose && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.purpose}
                </p>
              )}
            </div>
          </div>

          {/* 日期選擇 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              {t('booking.form.date')} *
            </label>
            <input
              type="date"
              value={formData.date}
              min={format(startOfToday(), 'yyyy-MM-dd')}
              max={format(addDays(startOfToday(), 90), 'yyyy-MM-dd')}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value, timeSlots: [] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* 時段選擇 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              {t('booking.form.timeSlots')} *
              <span className="text-xs text-gray-500 ml-2">
                ({t('booking.form.maxSlots', { max: venue.maxSlots })})
              </span>
            </label>
            <TimeSlotSelector
              venueId={venueId}
              selectedDate={formData.date}
              selectedSlots={formData.timeSlots}
              onSlotsChange={(slots) => setFormData(prev => ({ ...prev, timeSlots: slots }))}
              maxSlots={venue.maxSlots}
            />
            {errors.timeSlots && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.timeSlots}
              </p>
            )}
          </div>

          {/* 備註 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              {t('booking.form.notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
              placeholder={t('booking.form.notesPlaceholder')}
            />
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('booking.form.submitting')}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('booking.form.submit')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
```

### 日曆視圖 (src/components/CalendarView.tsx)

```tsx
import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths, isToday, isSameDay, parseISO, isWithinInterval, startOfDay, endOfDay, addDays, startOfWeek as startOfWeekFns, endOfWeek as endOfWeekFns, addWeeks, subWeeks } from 'date-fns';
import { zhTW, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import BookingModal from './BookingModal';

interface CalendarViewProps {
  venueId: string;
}

type ViewMode = 'month' | 'week' | 'day' | 'agenda';

const CalendarView: React.FC<CalendarViewProps> = ({ venueId }) => {
  const { t, language } = useLanguage();
  const { bookings } = useBooking();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const locale = language === 'zh' ? zhTW : enUS;

  const venueBookings = useMemo(() => 
    bookings.filter(b => b.venueId === venueId && b.status === 'confirmed'),
    [bookings, venueId]
  );

  const navigateDate = (direction: 'prev' | 'next') => {
    switch (viewMode) {
      case 'month':
        setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : addDays(currentDate, -1));
        break;
    }
  };

  const getDateTitle = () => {
    switch (viewMode) {
      case 'month':
        return format(currentDate, 'yyyy年MM月', { locale });
      case 'week':
        const weekStart = startOfWeekFns(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeekFns(currentDate, { weekStartsOn: 1 });
        return `${format(weekStart, 'MM/dd', { locale })} - ${format(weekEnd, 'MM/dd', { locale })}`;
      case 'day':
        return format(currentDate, 'yyyy年MM月dd日', { locale });
      default:
        return '';
    }
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return venueBookings.filter(booking => booking.date === dateStr);
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weekdays = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

    return (
      <div className="bg-white rounded-lg shadow">
        {/* 週標題 */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekdays.map(day => (
            <div key={day} className="p-4 text-center font-semibold text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>
        
        {/* 日期網格 */}
        <div className="grid grid-cols-7">
          {days.map(day => {
            const dayBookings = getBookingsForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isTodayDate = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] p-2 border-b border-r border-gray-100 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isTodayDate ? 'bg-red-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isTodayDate ? 'bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayBookings.slice(0, 3).map(booking => (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded cursor-pointer hover:bg-red-200 transition-colors"
                    >
                      <div className="font-medium truncate">{booking.name}</div>
                      <div className="text-red-600 truncate">
                        {booking.company} - {booking.purpose}
                      </div>
                      <div className="text-red-500 text-xs">
                        {booking.timeSlots[0]} {booking.timeSlots.length > 1 ? `+${booking.timeSlots.length - 1}` : ''}
                      </div>
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <div className="text-xs text-gray-500 px-2">
                      還有 {dayBookings.length - 3} 個預約...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeekFns(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* 週標題 */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4"></div>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="p-4 text-center">
              <div className="font-semibold text-gray-600 text-sm">
                {format(day, 'EEE', { locale })}
              </div>
              <div className={`text-lg font-bold ${isToday(day) ? 'text-red-500' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        {/* 時間表 */}
        <div className="max-h-[600px] overflow-y-auto">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-100 min-h-[60px]">
              <div className="p-2 text-xs text-gray-500 border-r border-gray-100">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {weekDays.map(day => {
                const dayBookings = getBookingsForDate(day).filter(booking =>
                  booking.timeSlots.some(slot => {
                    const [slotHour] = slot.split(':').map(Number);
                    return slotHour === hour;
                  })
                );
                
                return (
                  <div key={`${day.toISOString()}-${hour}`} className="p-1 border-r border-gray-100">
                    {dayBookings.map(booking => {
                      const relevantSlots = booking.timeSlots.filter(slot => {
                        const [slotHour] = slot.split(':').map(Number);
                        return slotHour === hour;
                      });
                      
                      return relevantSlots.map(slot => (
                        <div
                          key={`${booking.id}-${slot}`}
                          onClick={() => setSelectedBooking(booking)}
                          className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded cursor-pointer hover:bg-red-200 transition-colors mb-1"
                        >
                          <div className="font-medium truncate">{booking.name}</div>
                          <div className="text-red-600">{slot}</div>
                        </div>
                      ));
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayBookings = getBookingsForDate(currentDate);

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'yyyy年MM月dd日', { locale })} ({format(currentDate, 'EEEE', { locale })})
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            共 {dayBookings.length} 個預約
          </p>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto">
          {hours.map(hour => {
            const hourBookings = dayBookings.filter(booking =>
              booking.timeSlots.some(slot => {
                const [slotHour] = slot.split(':').map(Number);
                return slotHour === hour;
              })
            );
            
            return (
              <div key={hour} className="flex border-b border-gray-100 min-h-[80px]">
                <div className="w-16 p-4 text-sm text-gray-500 border-r border-gray-100">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 p-4">
                  {hourBookings.map(booking => {
                    const relevantSlots = booking.timeSlots.filter(slot => {
                      const [slotHour] = slot.split(':').map(Number);
                      return slotHour === hour;
                    });
                    
                    return relevantSlots.map(slot => (
                      <div
                        key={`${booking.id}-${slot}`}
                        onClick={() => setSelectedBooking(booking)}
                        className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2 cursor-pointer hover:bg-red-100 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{booking.name}</div>
                            <div className="text-sm text-gray-600">{booking.company}</div>
                            <div className="text-sm text-red-600 mt-1">{slot}</div>
                          </div>
                          <div className="text-xs text-gray-500">{booking.purpose}</div>
                        </div>
                      </div>
                    ));
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const upcomingBookings = venueBookings
      .filter(booking => new Date(booking.date + 'T00:00:00') >= startOfDay(new Date()))
      .sort((a, b) => {
        const dateA = new Date(a.date + 'T00:00:00');
        const dateB = new Date(b.date + 'T00:00:00');
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 50);

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">即將到來的預約</h3>
          <p className="text-sm text-gray-500 mt-1">
            共 {upcomingBookings.length} 個預約
          </p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {upcomingBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              沒有即將到來的預約
            </div>
          ) : (
            upcomingBookings.map(booking => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium text-gray-900">{booking.name}</div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {booking.company}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{booking.purpose}</div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {format(parseISO(booking.date + 'T00:00:00'), 'yyyy/MM/dd (EEEE)', { locale })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {booking.timeSlots.join(', ')}
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="text-sm text-gray-600 mt-2 bg-gray-50 rounded px-2 py-1">
                        {booking.notes}
                      </div>
                    )}
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 ml-2" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 控制列 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('calendar.today')}
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
              {getDateTitle()}
            </h2>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 視圖切換 */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {(['month', 'week', 'day', 'agenda'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === mode
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t(`calendar.${mode}`)}
            </button>
          ))}
        </div>
      </div>

      {/* 日曆內容 */}
      <div>
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'agenda' && renderAgendaView()}
      </div>

      {/* 預約詳情模態框 */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          showCancelOption={true}
        />
      )}
    </div>
  );
};

export default CalendarView;
```

### 時段選擇器 (src/components/TimeSlotSelector.tsx)

```tsx
import React from 'react';
import { format, parseISO } from 'date-fns';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';

interface TimeSlotSelectorProps {
  venueId: string;
  selectedDate: string;
  selectedSlots: string[];
  onSlotsChange: (slots: string[]) => void;
  maxSlots: number;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  venueId,
  selectedDate,
  selectedSlots,
  onSlotsChange,
  maxSlots
}) => {
  const { bookings } = useBooking();
  const { t } = useLanguage();

  // 生成時段 (30分鐘間隔，24小時制)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = minute === 30 ? hour + 1 : hour;
        const endMinute = minute === 30 ? 0 : minute + 30;
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        slots.push(`${startTime}-${endTime}`);
      }
    }
    return slots;
  };

  // 獲取已預約的時段
  const getBookedSlots = () => {
    return bookings
      .filter(b => b.venueId === venueId && b.date === selectedDate && b.status === 'confirmed')
      .flatMap(b => b.timeSlots);
  };

  const allTimeSlots = generateTimeSlots();
  const bookedSlots = getBookedSlots();

  const toggleSlot = (slot: string) => {
    if (bookedSlots.includes(slot)) return;

    if (selectedSlots.includes(slot)) {
      onSlotsChange(selectedSlots.filter(s => s !== slot));
    } else if (selectedSlots.length < maxSlots) {
      const newSlots = [...selectedSlots, slot].sort();
      onSlotsChange(newSlots);
    }
  };

  const getSlotStatus = (slot: string) => {
    if (bookedSlots.includes(slot)) return 'booked';
    if (selectedSlots.includes(slot)) return 'selected';
    if (selectedSlots.length >= maxSlots && !selectedSlots.includes(slot)) return 'disabled';
    return 'available';
  };

  const getSlotClassName = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200';
      case 'selected':
        return 'bg-red-500 text-white border-red-500 hover:bg-red-600';
      case 'disabled':
        return 'bg-gray-50 text-gray-300 cursor-not-allowed border-gray-200';
      default:
        return 'bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-300 cursor-pointer';
    }
  };

  return (
    <div className="space-y-4">
      {/* 時段選擇網格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {allTimeSlots.map(slot => {
          const status = getSlotStatus(slot);
          return (
            <button
              key={slot}
              type="button"
              onClick={() => toggleSlot(slot)}
              disabled={status === 'booked' || status === 'disabled'}
              className={`p-2 text-sm font-medium rounded-lg border transition-colors ${getSlotClassName(status)}`}
            >
              {slot}
            </button>
          );
        })}
      </div>

      {/* 選擇狀態說明 */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          <span className="text-gray-600">{t('timeSlots.available')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-600">{t('timeSlots.selected')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
          <span className="text-gray-600">{t('timeSlots.booked')}</span>
        </div>
      </div>

      {/* 已選時段摘要 */}
      {selectedSlots.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-2">
            {t('timeSlots.selectedSlots')} ({selectedSlots.length}/{maxSlots})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedSlots.map(slot => (
              <span
                key={slot}
                className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                {slot}
                <button
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 text-sm text-red-700">
            {t('timeSlots.totalDuration')}: {selectedSlots.length * 0.5} {t('timeSlots.hours')}
          </div>
        </div>
      )}

      {/* 今日已預約時段 */}
      {bookedSlots.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">
            {t('timeSlots.bookedSlots')} ({format(parseISO(selectedDate + 'T00:00:00'), 'yyyy/MM/dd')})
          </h4>
          <div className="flex flex-wrap gap-2">
            {bookedSlots.map(slot => (
              <span
                key={slot}
                className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
              >
                {slot}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
```

### 場地規則 (src/components/VenueRules.tsx)

```tsx
import React from 'react';
import { AlertTriangle, CheckCircle, Star, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VenueRules = () => {
  const { t } = useLanguage();

  const rules = [
    {
      title: t('rules.usage.title'),
      icon: CheckCircle,
      items: [
        t('rules.usage.item1'),
        t('rules.usage.item2'),
        t('rules.usage.item3'),
        t('rules.usage.item4'),
        t('rules.usage.item5'),
        t('rules.usage.item6'),
        t('rules.usage.item7'),
        t('rules.usage.item8'),
        t('rules.usage.item9')
      ]
    }
  ];

  const penalties = [
    {
      title: t('rules.penalties.title'),
      icon: AlertTriangle,
      items: [
        t('rules.penalties.item1'),
        t('rules.penalties.item2'),
        t('rules.penalties.item3'),
        t('rules.penalties.item4')
      ]
    }
  ];

  const priorities = [
    {
      title: t('rules.priorities.title'),
      icon: Star,
      items: [
        t('rules.priorities.item1'),
        t('rules.priorities.item2'),
        t('rules.priorities.item3'),
        t('rules.priorities.item4'),
        t('rules.priorities.item5'),
        t('rules.priorities.item6'),
        t('rules.priorities.item7')
      ]
    }
  ];

  const RuleSection: React.FC<{ sections: any[], bgColor: string, iconColor: string }> = ({ sections, bgColor, iconColor }) => (
    <>
      {sections.map((section, sectionIndex) => {
        const Icon = section.icon;
        return (
          <div key={sectionIndex} className={`${bgColor} border border-gray-200 rounded-xl p-6`}>
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center mr-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
            </div>
            <ul className="space-y-3">
              {section.items.map((item: string, itemIndex: number) => (
                <li key={itemIndex} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-semibold text-gray-600">{itemIndex + 1}</span>
                  </div>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 標題 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('rules.title')}
        </h2>
        <p className="text-gray-600">
          {t('rules.subtitle')}
        </p>
      </div>

      {/* 場地資訊 */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-xl p-6">
        <h3 className="text-lg font-bold text-red-900 mb-4">場地資訊</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-gray-700">營業時間：24小時</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-gray-700">最小預約單位：30分鐘</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-gray-700">最長預約時間：2小時</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-gray-700">取消政策：可取消</span>
          </div>
        </div>
      </div>

      {/* 使用規則 */}
      <RuleSection sections={rules} bgColor="bg-blue-50" iconColor="bg-blue-500" />

      {/* 計點規範 */}
      <RuleSection sections={penalties} bgColor="bg-red-50" iconColor="bg-red-500" />

      {/* 使用優先次序 */}
      <RuleSection sections={priorities} bgColor="bg-amber-50" iconColor="bg-amber-500" />

      {/* 聯絡資訊 */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-4">聯絡我們</h3>
        <p className="text-gray-600 mb-2">
          如有任何疑問或需要協調預約衝突，請聯絡行政端
        </p>
        <p className="text-red-600 font-medium">
          Email: cslaplus@gmail.com
        </p>
      </div>
    </div>
  );
};

export default VenueRules;
```

### 管理員登入 (src/components/AdminLogin.tsx)

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from '../utils/toast';

const AdminLogin = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = location.state?.redirectTo || '/';

  useEffect(() => {
    // 如果已經登入，直接跳轉
    const user = localStorage.getItem('adminUser');
    if (user) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 模擬 API 驗證延遲
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (login(password)) {
        toast.success(t('admin.loginSuccess'));
        navigate(redirectTo);
      } else {
        toast.error(t('admin.loginError'));
      }
    } catch (error) {
      toast.error(t('admin.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 返回按鈕 */}
        <div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </button>
        </div>

        {/* 登入表單 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold">{t('admin.title')}</h2>
            <p className="text-red-100 mt-2">{t('admin.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                  placeholder={t('admin.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('admin.verifying')}
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  {t('admin.loginButton')}
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                {t('admin.hint')}
              </p>
            </div>
          </form>
        </div>

        {/* 提示信息 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <Shield className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">{t('admin.securityNotice')}</p>
              <p>{t('admin.securityDescription')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
```

### 管理員面板 (src/components/AdminPanel.tsx)

```tsx
import React, { useState, useMemo } from 'react';
import { Download, Trash2, Calendar, Users, BarChart3, AlertTriangle, Filter, Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';

interface AdminPanelProps {
  venueId: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ venueId }) => {
  const { t } = useLanguage();
  const { bookings, cancelBooking, exportBookings } = useBooking();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  if (!user) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <p className="text-gray-500">{t('admin.accessDenied')}</p>
      </div>
    );
  }

  const venueBookings = useMemo(() => {
    let filtered = bookings.filter(b => b.venueId === venueId);

    // 狀態過濾
    if (filter !== 'all') {
      filtered = filtered.filter(b => b.status === filter);
    }

    // 搜索過濾
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm) ||
        b.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 日期範圍過濾
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(b => 
        b.date >= dateRange.start && b.date <= dateRange.end
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings, venueId, filter, searchTerm, dateRange]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm(t('admin.confirmCancel'))) return;

    try {
      await cancelBooking(bookingId, 'admin', '管理員取消');
      toast.success(t('admin.cancelSuccess'));
    } catch (error) {
      toast.error(t('admin.cancelError'));
    }
  };

  const handleExport = () => {
    try {
      const exported = exportBookings(venueId);
      
      // 創建並下載 CSV 文件
      const csv = convertToCSV(exported);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${venueId}-bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(t('admin.exportSuccess'));
    } catch (error) {
      toast.error(t('admin.exportError'));
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = ['ID', '姓名', '電子信箱', '電話', '公司', '使用目的', '預約日期', '時段', '狀態', '備註', '建立時間'];
    const rows = data.map(booking => [
      booking.id,
      booking.name,
      booking.email,
      booking.phone,
      booking.company,
      booking.purpose,
      booking.date,
      booking.timeSlots.join('; '),
      booking.status === 'confirmed' ? '確認' : '取消',
      booking.notes || '',
      format(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm:ss')
    ]);
    
    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  };

  const stats = useMemo(() => {
    const confirmed = venueBookings.filter(b => b.status === 'confirmed').length;
    const cancelled = venueBookings.filter(b => b.status === 'cancelled').length;
    const totalSlots = venueBookings
      .filter(b => b.status === 'confirmed')
      .reduce((acc, b) => acc + b.timeSlots.length, 0);
    
    return { total: venueBookings.length, confirmed, cancelled, totalSlots };
  }, [venueBookings]);

  return (
    <div className="space-y-6">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">{t('admin.stats.total')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              <p className="text-sm text-gray-500">{t('admin.stats.confirmed')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              <p className="text-sm text-gray-500">{t('admin.stats.cancelled')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSlots}</p>
              <p className="text-sm text-gray-500">{t('admin.stats.slots')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 控制列 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('admin.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">{t('admin.filter.all')}</option>
              <option value="confirmed">{t('admin.filter.confirmed')}</option>
              <option value="cancelled">{t('admin.filter.cancelled')}</option>
            </select>
            
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('admin.export')}
            </button>
          </div>
        </div>
      </div>

      {/* 預約列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('admin.bookingList')} ({venueBookings.length})
          </h3>
        </div>
        
        {venueBookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('admin.noBookings')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.booker')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.contact')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.company')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.slots')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.status')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {venueBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                        <div className="text-sm text-gray-500">{booking.purpose}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(parseISO(booking.date + 'T00:00:00'), 'yyyy/MM/dd', { locale: zhTW })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {booking.timeSlots.map(slot => (
                          <span key={slot} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status === 'confirmed' ? t('admin.status.confirmed') : t('admin.status.cancelled')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="inline-flex items-center px-3 py-1 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          {t('admin.cancel')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
```

### 預約詳情模態框 (src/components/BookingModal.tsx)

```tsx
import React from 'react';
import { X, Calendar, Clock, User, Building, Target, MessageSquare, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { toast } from '../utils/toast';

interface BookingModalProps {
  booking: any;
  onClose: () => void;
  showCancelOption?: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({ booking, onClose, showCancelOption = false }) => {
  const { t } = useLanguage();
  const { cancelBooking } = useBooking();
  const [showCancelForm, setShowCancelForm] = React.useState(false);
  const [cancelData, setCancelData] = React.useState({ email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cancelData.email && !cancelData.phone) {
      toast.error('請輸入電子信箱或電話');
      return;
    }

    // 驗證電子信箱或電話是否匹配
    const emailMatch = cancelData.email && booking.email === cancelData.email;
    const phoneMatch = cancelData.phone && booking.phone === cancelData.phone;
    
    if (!emailMatch && !phoneMatch) {
      toast.error('電子信箱或電話不正確');
      return;
    }

    setIsSubmitting(true);
    try {
      await cancelBooking(booking.id, 'user', '用戶取消');
      toast.success('預約已成功取消');
      onClose();
    } catch (error) {
      toast.error('取消預約失敗，請稍後重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 標題 */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold">預約詳情</h3>
        </div>

        {/* 內容 */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">預約人</p>
                <p className="font-medium text-gray-900">{booking.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">公司</p>
                <p className="font-medium text-gray-900">{booking.company}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">使用目的</p>
                <p className="font-medium text-gray-900">{booking.purpose}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">預約日期</p>
                <p className="font-medium text-gray-900">
                  {format(parseISO(booking.date + 'T00:00:00'), 'yyyy年MM月dd日 (EEEE)', { locale: zhTW })}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">預約時段</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {booking.timeSlots.map((slot: string) => (
                    <span key={slot} className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                      {slot}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  總時長：{booking.timeSlots.length * 0.5} 小時
                </p>
              </div>
            </div>

            {booking.notes && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">備註</p>
                  <p className="font-medium text-gray-900">{booking.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* 狀態 */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">預約狀態</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                booking.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {booking.status === 'confirmed' ? '已確認' : '已取消'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">建立時間</span>
              <span className="text-sm text-gray-900">
                {format(new Date(booking.createdAt), 'yyyy/MM/dd HH:mm')}
              </span>
            </div>
          </div>

          {/* 取消預約功能 */}
          {showCancelOption && booking.status === 'confirmed' && (
            <div className="pt-4 border-t border-gray-200">
              {!showCancelForm ? (
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  取消預約
                </button>
              ) : (
                <form onSubmit={handleCancelSubmit} className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      請輸入預約時使用的電子信箱或電話以驗證身份
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      電子信箱
                    </label>
                    <input
                      type="email"
                      value={cancelData.email}
                      onChange={(e) => setCancelData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="請輸入預約時的電子信箱"
                    />
                  </div>
                  
                  <div className="text-center text-sm text-gray-500">或</div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      聯絡電話
                    </label>
                    <input
                      type="tel"
                      value={cancelData.phone}
                      onChange={(e) => setCancelData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="請輸入預約時的電話"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCancelForm(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? '處理中...' : '確認取消'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* 關閉按鈕 */}
        <div className="px-6 pb-6">
          {!showCancelForm && (
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            關閉
          </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
```

### UI 組件

#### 語言切換 (src/components/ui/LanguageToggle.tsx)

```tsx
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <button
        onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Globe className="w-4 h-4 mr-2" />
        {language === 'zh' ? '繁' : 'EN'}
      </button>
    </div>
  );
};

export default LanguageToggle;
```

#### 通知系統 (src/components/ui/Toaster.tsx)

```tsx
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

let toasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

export const toast = {
  success: (title: string, options?: { description?: string; duration?: number }) => {
    addToast({ type: 'success', title, ...options });
  },
  error: (title: string, options?: { description?: string; duration?: number }) => {
    addToast({ type: 'error', title, ...options });
  },
  warning: (title: string, options?: { description?: string; duration?: number }) => {
    addToast({ type: 'warning', title, ...options });
  },
  info: (title: string, options?: { description?: string; duration?: number }) => {
    addToast({ type: 'info', title, ...options });
  }
};

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: Toast = {
    id,
    duration: 5000,
    ...toast
  };
  
  toasts = [newToast, ...toasts];
  listeners.forEach(listener => listener(toasts));
  
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => removeToast(id), newToast.duration);
  }
};

const removeToast = (id: string) => {
  toasts = toasts.filter(t => t.id !== id);
  listeners.forEach(listener => listener(toasts));
};

export const Toaster = () => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toasts: Toast[]) => setToastList([...toasts]);
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  if (toastList.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastList.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500'
  };

  const Icon = icons[toast.type];

  return (
    <div className={`w-80 p-4 rounded-lg border shadow-lg transition-all duration-300 ${colors[toast.type]}`}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 mt-0.5 mr-3 ${iconColors[toast.type]}`} />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm mt-1 opacity-90">{toast.description}</p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
```

### Context 狀態管理

#### 認證狀態 (src/context/AuthContext.tsx)

```tsx
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
```

#### 預約資料管理 (src/context/BookingContext.tsx)

```tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { format } from 'date-fns';

export interface Booking {
  id: string;
  venueId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  purpose: string;
  date: string;
  timeSlots: string[];
  notes?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
  cancelledAt?: Date;
  cancelledBy?: 'user' | 'admin';
  cancelReason?: string;
  confirmationCode: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string, cancelledBy: 'user' | 'admin', reason?: string) => Promise<void>;
  exportBookings: (venueId?: string) => Booking[];
  getBookingsByDate: (venueId: string, date: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = 'venueBookings';

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // 從 localStorage 載入資料
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const bookingsWithDates = parsed.map((booking: any) => ({
          ...booking,
          createdAt: new Date(booking.createdAt),
          cancelledAt: booking.cancelledAt ? new Date(booking.cancelledAt) : undefined
        }));
        setBookings(bookingsWithDates);
      } catch (error) {
        console.error('Error loading bookings from localStorage:', error);
        setBookings([]);
      }
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
    
    // 記錄操作日誌
    const log = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      operation: '新增預約',
      details: {
        預約人: booking.name,
        公司: booking.company,
        日期: booking.date,
        時段: booking.timeSlots.join(', '),
        聯絡電話: booking.phone,
        確認碼: booking.confirmationCode
      }
    };
    
    const logs = JSON.parse(localStorage.getItem('operationLogs') || '[]');
    logs.push(log);
    localStorage.setItem('operationLogs', JSON.stringify(logs));
  };

  const cancelBooking = async (bookingId: string, cancelledBy: 'user' | 'admin', reason?: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setBookings(prev => prev.map(booking => {
          if (booking.id === bookingId) {
            const updatedBooking = {
              ...booking,
              status: 'cancelled' as const,
              cancelledAt: new Date(),
              cancelledBy,
              cancelReason: reason
            };
            
            // 記錄操作日誌
            const log = {
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              operation: '取消預約',
              details: {
                預約人: booking.name,
                取消者: cancelledBy === 'admin' ? '管理員' : '用戶',
                原預約日期: booking.date,
                原時段: booking.timeSlots.join(', '),
                取消原因: reason || '未提供'
              }
            };
            
            const logs = JSON.parse(localStorage.getItem('operationLogs') || '[]');
            logs.push(log);
            localStorage.setItem('operationLogs', JSON.stringify(logs));
            
            return updatedBooking;
          }
          return booking;
        }));
        resolve();
      }, 500); // 模擬 API 延遲
    });
  };

  const exportBookings = (venueId?: string): Booking[] => {
    let exportData = bookings;
    if (venueId) {
      exportData = bookings.filter(b => b.venueId === venueId);
    }
    return exportData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getBookingsByDate = (venueId: string, date: string): Booking[] => {
    return bookings.filter(b => 
      b.venueId === venueId && 
      b.date === date && 
      b.status === 'confirmed'
    );
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      cancelBooking,
      exportBookings,
      getBookingsByDate
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
```

#### 多語言支援 (src/context/LanguageContext.tsx)

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  zh: {
    // 通用
    'common.subtitle': '專業場地預約系統',
    'common.bookNow': '立即預約',
    'common.adminRequired': '需要管理員權限',
    'common.back': '返回',
    'common.loading': '載入中...',
    'common.cancel': '取消',
    'common.confirm': '確認',

    // 首頁
    'home.hero.title': '專業級場地預約',
    'home.hero.description': '提供專業的錄音室和練習空間，配備最新設備，為您的創作和練習提供完美環境',
    'home.features.title': '為什麼選擇我們',
    'home.features.professional.title': '專業設備',
    'home.features.professional.description': '頂級錄音設備和專業隔音設計',
    'home.features.available.title': '24小時開放',
    'home.features.available.description': '全天候開放，隨時滿足您的創作需求',
    'home.features.management.title': '智能管理',
    'home.features.management.description': '先進的預約管理系統，預約、取消一鍵完成',

    // 場地
    'venues.dongmenLarge.name': '東門錄音室（大）',
    'venues.dongmenLarge.description': '專業大型錄音室，適合樂團錄音和音樂製作',
    'venues.dongmenSmall.name': '東門錄音室（小）',
    'venues.dongmenSmall.description': '精緻小型錄音室，適合個人錄音和配音工作',
    'venues.gutingPractice.name': '古亭練習室',
    'venues.gutingPractice.description': '寬敞練習空間，配備專業音響和舞蹈設備',

    // 導航
    'nav.booking': '預約',
    'nav.calendar': '日曆',
    'nav.rules': '使用規則',
    'nav.admin': '管理',

    // 預約表單
    'booking.form.title': '預約場地',
    'booking.form.subtitle': '請填寫以下資訊完成預約',
    'booking.form.name': '姓名或藝名',
    'booking.form.namePlaceholder': '請輸入您的姓名或藝名',
    'booking.form.phone': '聯絡電話',
    'booking.form.phonePlaceholder': '請輸入聯絡電話',
    'booking.form.email': '電子信箱',
    'booking.form.emailPlaceholder': '請輸入電子信箱',
    'booking.form.company': '公司',
    'booking.form.selectCompany': '請選擇公司',
    'booking.form.purpose': '使用目的',
    'booking.form.selectPurpose': '請選擇使用目的',
    'booking.form.date': '預約日期',
    'booking.form.timeSlots': '預約時段',
    'booking.form.maxSlots': '最多選擇 {max} 個時段',
    'booking.form.notes': '備註',
    'booking.form.notesPlaceholder': '如有特殊需求請在此說明...',
    'booking.form.submit': '確認預約',
    'booking.form.submitting': '提交中...',

    // 時段選擇
    'timeSlots.available': '可預約',
    'timeSlots.selected': '已選擇',
    'timeSlots.booked': '已預約',
    'timeSlots.selectedSlots': '已選時段',
    'timeSlots.totalDuration': '總時長',
    'timeSlots.hours': '小時',
    'timeSlots.bookedSlots': '已預約時段',

    // 日曆
    'calendar.today': '今天',
    'calendar.month': '月',
    'calendar.week': '週',
    'calendar.day': '日',
    'calendar.agenda': '議程',

    // 管理員
    'admin.login': '管理員登入',
    'admin.loggedIn': '已登入',
    'admin.logout': '登出',
    'admin.loginRequired': '需要登入',
    'admin.title': '管理員登入',
    'admin.subtitle': '請輸入管理員密碼',
    'admin.password': '管理員密碼',
    'admin.passwordPlaceholder': '請輸入管理員密碼',
    'admin.loginButton': '登入',
    'admin.verifying': '驗證中...',
    'admin.hint': '管理員功能包含預約管理、數據匯出等',
    'admin.securityNotice': '安全提醒',
    'admin.securityDescription': '請確保在安全環境下輸入密碼，登入狀態24小時後自動過期',
    'admin.loginSuccess': '登入成功',
    'admin.loginError': '密碼錯誤，請重新輸入',
    'admin.accessDenied': '需要管理員權限才能訪問',

    // 驗證
    'validation.nameRequired': '請輸入姓名',
    'validation.emailRequired': '請輸入電子信箱',
    'validation.emailInvalid': '請輸入有效的電子信箱',
    'validation.phoneRequired': '請輸入聯絡電話',
    'validation.phoneInvalid': '請輸入有效的電話號碼',
    'validation.companyRequired': '請選擇公司',
    'validation.purposeRequired': '請選擇使用目的',
    'validation.timeSlotsRequired': '請選擇預約時段',
    'validation.maxSlots': '最多只能選擇 {max} 個時段',
    'validation.slotConflict': '時段 {slots} 已被預約，請選擇其他時段',

    // 預約結果
    'booking.success.title': '預約成功！',
    'booking.success.description': '您的預約已確認',
    'booking.error.title': '預約失敗',
    'booking.error.description': '預約過程中發生錯誤，請稍後重試',

    // 使用規則
    'rules.title': '古亭練習室使用規則',
    'rules.subtitle': '請仔細閱讀並遵守以下使用規定',
    'rules.usage.title': '一、使用規則',
    'rules.usage.item1': '除了老師之外，全面禁止飲食（可喝水、無糖飲料），垃圾自行帶走',
    'rules.usage.item2': '使用瑜珈墊和抱枕前須先掃地+拖地',
    'rules.usage.item3': '一進教室協助倒掉除濕機的水，離開教室要打開除濕機',
    'rules.usage.item4': '使用後場地要復原，椅子或器材請放回原位並排整齊',
    'rules.usage.item5': '使用音響系統請根據教學步驟打開，使用後請根據步驟關閉',
    'rules.usage.item6': '音響系統已經過校正和測試，使用音量請符合規定',
    'rules.usage.item7': '練習時務必關門及上鎖',
    'rules.usage.item8': '請勿私下打鑰匙，可以小組內借。個人練習可以和小組長拿鑰匙',
    'rules.usage.item9': '對外教學請洽行政端',
    'rules.penalties.title': '二、計點規範',
    'rules.penalties.item1': '使用瑜伽墊和抱枕前未打掃、違規飲食：記一點',
    'rules.penalties.item2': '沒關冷氣、私打鑰匙：禁用一個月',
    'rules.penalties.item3': '沒關音響、設備：記兩點',
    'rules.penalties.item4': '一個月內被記兩點即禁止使用場地兩週',
    'rules.priorities.title': '三、使用優先次序',
    'rules.priorities.item1': '公司藝人培訓課程',
    'rules.priorities.item2': '公司商演練習（不含跑場）',
    'rules.priorities.item3': '對外教學租借使用',
    'rules.priorities.item4': '小組評比練習',
    'rules.priorities.item5': '藝人等級',
    'rules.priorities.item6': '準藝人等級',
    'rules.priorities.item7': 'S級',

    // 管理面板
    'admin.stats.total': '總預約',
    'admin.stats.confirmed': '已確認',
    'admin.stats.cancelled': '已取消',
    'admin.stats.slots': '總時段',
    'admin.search': '搜尋預約（姓名、電話、信箱）',
    'admin.filter.all': '全部',
    'admin.filter.confirmed': '已確認',
    'admin.filter.cancelled': '已取消',
    'admin.export': '匯出',
    'admin.bookingList': '預約列表',
    'admin.noBookings': '暫無預約記錄',
    'admin.table.booker': '預約人',
    'admin.table.contact': '聯絡方式',
    'admin.table.company': '公司',
    'admin.table.date': '日期',
    'admin.table.slots': '時段',
    'admin.table.status': '狀態',
    'admin.table.actions': '操作',
    'admin.status.confirmed': '已確認',
    'admin.status.cancelled': '已取消',
    'admin.cancel': '取消',
    'admin.confirmCancel': '確定要取消這個預約嗎？',
    'admin.cancelSuccess': '預約已取消',
    'admin.cancelError': '取消失敗',
    'admin.exportSuccess': '匯出成功',
    'admin.exportError': '匯出失敗'
  },
  en: {
    // Common
    'common.subtitle': 'Professional Venue Booking System',
    'common.bookNow': 'Book Now',
    'common.adminRequired': 'Admin Access Required',
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',

    // Home
    'home.hero.title': 'Professional Venue Booking',
    'home.hero.description': 'Professional recording studios and practice spaces with latest equipment for your creative needs',
    'home.features.title': 'Why Choose Us',
    'home.features.professional.title': 'Professional Equipment',
    'home.features.professional.description': 'Top-tier recording equipment with professional soundproofing',
    'home.features.available.title': '24/7 Available',
    'home.features.available.description': 'Open around the clock for your creative schedule',
    'home.features.management.title': 'Smart Management',
    'home.features.management.description': 'Advanced booking system with easy reservation and cancellation',

    // Venues
    'venues.dongmenLarge.name': 'Dongmen Studio (Large)',
    'venues.dongmenLarge.description': 'Professional large recording studio for band recording and music production',
    'venues.dongmenSmall.name': 'Dongmen Studio (Small)',
    'venues.dongmenSmall.description': 'Intimate small studio perfect for solo recording and voice work',
    'venues.gutingPractice.name': 'Guting Practice Room',
    'venues.gutingPractice.description': 'Spacious practice space with professional audio and dance equipment'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string, params?: Record<string, any>): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [key, value]) => str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
        translation
      );
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

### 配置文件

#### 場地配置 (src/config/venues.ts)

```tsx
export const venueConfigs = {
  'dongmen-large': {
    id: 'dongmen-large',
    nameKey: 'venues.dongmenLarge.name',
    descriptionKey: 'venues.dongmenLarge.description',
    adminOnly: true,
    businessHours: '24H',
    minBookingUnit: 30, // 分鐘
    maxBookingDuration: 120, // 分鐘 (2小時)
    maxSlots: 4,
    companies: ['SS Peaks', '藤原瓔唱片', '熾盛娛樂', '其他'],
    purposes: ['發行作品錄音', '客戶錄音', 'Demo錄音', '開會', '接案工作使用'],
    facilities: ['專業錄音設備', '調音台', '監聽音箱', 'MIDI鍵盤'],
    rules: {
      cancellationPolicy: '可取消',
      advanceBooking: '最多提前90天預約',
      restrictions: ['禁止飲食', '使用後請清潔設備']
    }
  },
  'dongmen-small': {
    id: 'dongmen-small',
    nameKey: 'venues.dongmenSmall.name',
    descriptionKey: 'venues.dongmenSmall.description',
    adminOnly: true,
    businessHours: '24H',
    minBookingUnit: 30,
    maxBookingDuration: 120,
    maxSlots: 4,
    companies: ['SS Peaks', '藤原瓔唱片', '熾盛娛樂', '其他'],
    purposes: ['發行作品錄音', '客戶錄音', 'Demo錄音', '開會', '接案工作使用'],
    facilities: ['錄音設備', '麥克風', '耳機', '音響'],
    rules: {
      cancellationPolicy: '可取消',
      advanceBooking: '最多提前90天預約',
      restrictions: ['禁止飲食', '使用後請清潔設備']
    }
  },
  'guting-practice': {
    id: 'guting-practice',
    nameKey: 'venues.gutingPractice.name',
    descriptionKey: 'venues.gutingPractice.description',
    adminOnly: false,
    businessHours: '24H',
    minBookingUnit: 30,
    maxBookingDuration: 120,
    maxSlots: 4,
    companies: ['SS Peaks', '熾盛娛樂', '藤原瓔唱片', '其他'],
    purposes: [
      '公司藝人培訓課程',
      '公司商演練習（不含跑場）',
      '對外教學租借使用',
      '小組評比練習',
      '藝人等級',
      '準藝人等級',
      'S級',
      '其他'
    ],
    facilities: ['投影機', '音響', '瑜珈墊', '抱枕', '除濕機'],
    rules: {
      cancellationPolicy: '可取消',
      advanceBooking: '最多提前90天預約',
      restrictions: [
        '除了老師之外，全面禁止飲食',
        '使用瑜珈墊和抱枕前須先掃地+拖地',
        '進出教室需協助除濕機水管理',
        '使用後場地要復原'
      ]
    }
  }
} as const;
```

#### 工具函數 (src/utils/toast.ts)

```tsx
// 這個文件導出 toast 函數，供其他組件使用
export { toast } from '../components/ui/Toaster';
```

### 樣式文件 (src/index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 配置文件

#### package.json

```json
{
  "name": "ss-peaks-venue-booking",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "date-fns": "^4.1.0",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.8.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

#### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

#### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

#### index.html

```html
<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SS Peaks Group 完整場地預約系統</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 功能特色

### 🏠 主頁面
- **場地展示卡片**：三個專業場地的精美展示
- **管理員權限控制**：東門錄音室需要管理員登入
- **響應式設計**：完美適配各種設備
- **多語言支援**：繁體中文/英文切換

### 📅 預約系統
- **智能表單驗證**：完整的前端驗證機制
- **時段衝突檢測**：避免重複預約
- **即時狀態更新**：預約狀態即時反映
- **30分鐘時段單位**：最多2小時預約限制

### 🗓️ 日曆功能
- **四種視圖模式**：月/週/日/議程視圖
- **預約詳情預覽**：點擊查看完整預約資訊
- **取消預約功能**：電話/信箱驗證取消機制
- **Google日曆級體驗**：流暢的操作體驗

### 🛡️ 管理員系統
- **安全登入機制**：密碼保護的管理員功能
- **完整統計面板**：預約數據統計分析
- **CSV匯出功能**：資料匯出和分析
- **強制取消權限**：管理員可取消任何預約

### 🎨 設計美學
- **Apple級設計品質**：精緻的視覺設計
- **暖紅色調配色**：專業而溫暖的色彩系統
- **微互動動畫**：流暢的過渡效果
- **專業攝影圖片**：高品質的場地展示圖片

---

## 部署說明

### 開發環境
```bash
npm install
npm run dev
```

### 生產環境
```bash
npm run build
npm run preview
```

### 環境需求
- Node.js 18+
- 現代瀏覽器支援
- localStorage 支援

---

## 管理員資訊

- **管理員密碼**：`SS2025Admin!`
- **登入有效期**：24小時
- **權限範圍**：所有場地管理、預約取消、資料匯出

---

## 聯絡資訊

- **技術支援**：cslaplus@gmail.com
- **系統管理**：SS Peaks Group 技術團隊
- **版本**：v2.0
- **最後更新**：2025-01-27

---

**🎉 SS Peaks Group 完整場地預約系統已準備就緒，提供專業級的預約管理體驗！**
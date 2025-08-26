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
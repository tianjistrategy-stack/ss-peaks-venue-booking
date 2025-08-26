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
      image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Mic2,
      gradient: 'from-orange-500/20 to-red-500/20',
      adminOnly: true
    },
    {
      id: 'guting-practice',
      nameKey: 'venues.gutingPractice.name',
      descriptionKey: 'venues.gutingPractice.description',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
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
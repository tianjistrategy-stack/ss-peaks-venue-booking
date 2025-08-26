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

      toast.success(t('booking.success.title'), {
        description: t('booking.success.description')
      });

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
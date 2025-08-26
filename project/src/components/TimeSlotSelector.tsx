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
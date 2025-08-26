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
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
import React from 'react';
import { X, Calendar, Clock, User, Building, Target, Phone, Mail, MessageSquare, MapPin, Trash2 } from 'lucide-react';
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
          <p className="text-red-100 text-sm mt-1">
            確認碼：{booking.confirmationCode}
          </p>
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
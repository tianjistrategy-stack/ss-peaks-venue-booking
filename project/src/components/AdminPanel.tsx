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
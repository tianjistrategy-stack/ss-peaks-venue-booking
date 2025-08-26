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
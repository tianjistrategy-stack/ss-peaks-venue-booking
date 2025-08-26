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
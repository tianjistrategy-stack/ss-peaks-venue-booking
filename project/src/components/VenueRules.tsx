import React from 'react';
import { AlertTriangle, CheckCircle, Star, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VenueRules = () => {
  const { t } = useLanguage();

  const rules = [
    {
      title: t('rules.usage.title'),
      icon: CheckCircle,
      items: [
        t('rules.usage.item1'),
        t('rules.usage.item2'),
        t('rules.usage.item3'),
        t('rules.usage.item4'),
        t('rules.usage.item5'),
        t('rules.usage.item6'),
        t('rules.usage.item7'),
        t('rules.usage.item8'),
        t('rules.usage.item9')
      ]
    }
  ];

  const penalties = [
    {
      title: t('rules.penalties.title'),
      icon: AlertTriangle,
      items: [
        t('rules.penalties.item1'),
        t('rules.penalties.item2'),
        t('rules.penalties.item3'),
        t('rules.penalties.item4')
      ]
    }
  ];

  const priorities = [
    {
      title: t('rules.priorities.title'),
      icon: Star,
      items: [
        t('rules.priorities.item1'),
        t('rules.priorities.item2'),
        t('rules.priorities.item3'),
        t('rules.priorities.item4'),
        t('rules.priorities.item5'),
        t('rules.priorities.item6'),
        t('rules.priorities.item7')
      ]
    }
  ];

  const RuleSection: React.FC<{ sections: any[], bgColor: string, iconColor: string }> = ({ sections, bgColor, iconColor }) => (
    <>
      {sections.map((section, sectionIndex) => {
        const Icon = section.icon;
        return (
          <div key={sectionIndex} className={`${bgColor} border border-gray-200 rounded-xl p-6`}>
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 ${iconColor} rounded-lg flex items-center justify-center mr-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
            </div>
            <ul className="space-y-3">
              {section.items.map((item: string, itemIndex: number) => (
                <li key={itemIndex} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-semibold text-gray-600">{itemIndex + 1}</span>
                  </div>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 標題 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('rules.title')}
        </h2>
        <p className="text-gray-600">
          {t('rules.subtitle')}
        </p>
      </div>

      {/* 場地資訊 */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-xl p-6">
        <h3 className="text-lg font-bold text-red-900 mb-4">場地資訊</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-gray-700">營業時間：24小時</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-gray-700">最小預約單位：30分鐘</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-gray-700">最長預約時間：2小時</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-gray-700">取消政策：可取消</span>
          </div>
        </div>
      </div>

      {/* 使用規則 */}
      <RuleSection sections={rules} bgColor="bg-blue-50" iconColor="bg-blue-500" />

      {/* 計點規範 */}
      <RuleSection sections={penalties} bgColor="bg-red-50" iconColor="bg-red-500" />

      {/* 使用優先次序 */}
      <RuleSection sections={priorities} bgColor="bg-amber-50" iconColor="bg-amber-500" />

      {/* 聯絡資訊 */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-4">聯絡我們</h3>
        <p className="text-gray-600 mb-2">
          如有任何疑問或需要協調預約衝突，請聯絡行政端
        </p>
        <p className="text-red-600 font-medium">
          Email: cslaplus@gmail.com
        </p>
      </div>
    </div>
  );
};

export default VenueRules;
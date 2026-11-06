import React from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

interface StatsSectionProps {
  isDarkMode: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ isDarkMode }) => {
  return (
    <section className={`py-12 border-b transition-colors duration-200 ${
      isDarkMode ? 'border-white/10 bg-slate-900/30' : 'border-slate-200 bg-slate-50/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className={`p-6 rounded-3xl border text-right transition-colors ${
            isDarkMode ? 'bg-[#121622] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-medium font-vazir ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ارزش کل دارایی‌ها (TVL)</span>
              <div className="w-8 h-8 rounded-xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-black font-outfit tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>$۲,۹۵۰,۰۰۰</div>
            <p className="text-xs text-emerald-500 font-medium mt-2 flex items-center gap-1 font-vazir">
              <span>↑ ۱۸.۴٪ رشد در ماه جاری</span>
            </p>
          </div>

          <div className={`p-6 rounded-3xl border text-right transition-colors ${
            isDarkMode ? 'bg-[#121622] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-medium font-vazir ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>سرمایه‌گذاران فعال</span>
              <div className="w-8 h-8 rounded-xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-black font-outfit tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>۱,۴۸۲ نفر</div>
            <p className={`text-xs font-medium mt-2 font-vazir ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              دارندگان توکن‌های RWA
            </p>
          </div>

          <div className={`p-6 rounded-3xl border text-right transition-colors ${
            isDarkMode ? 'bg-[#121622] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-medium font-vazir ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>میانگین سود سالانه (APY)</span>
              <div className="w-8 h-8 rounded-xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-black font-outfit tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>۲۸.۲٪</div>
            <p className={`text-xs font-medium mt-2 font-vazir ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              ترکیب اجاره و رشد ارزش دارایی
            </p>
          </div>

          <div className={`p-6 rounded-3xl border text-right transition-colors ${
            isDarkMode ? 'bg-[#121622] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-medium font-vazir ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>شبکه‌های فعال</span>
              <div className="w-8 h-8 rounded-xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-black font-outfit tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>Polygon & BSC</div>
            <p className="text-xs text-[#F7931A] font-medium mt-2 font-vazir">
              تسویه لحظه‌ای با کارمزد ناچیز
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

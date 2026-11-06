import React, { useState } from 'react';
import { 
  Settings, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  Sliders, 
  Coins, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../translations';

interface AdminDashboardProps {
  lang: Language;
  isDarkMode?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, isDarkMode = true }) => {
  const t = TRANSLATIONS[lang];
  const [protocolFeePercent, setProtocolFeePercent] = useState<number>(0.25);
  const [emergencyPause, setEmergencyPause] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveConfig = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in font-vazir">
      {/* Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors ${
        isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
      }`}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7931A]/10 text-[#F7931A] text-xs font-semibold mb-3">
            <Settings className="w-4 h-4 text-[#F7931A]" />
            <span>{t.roleAdmin}</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            {t.adminTitle}
          </h2>
          <p className={`text-xs sm:text-sm mt-2 max-w-2xl ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {t.adminDesc}
          </p>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs ${
          isDarkMode ? 'bg-black/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className={isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}>نودهای شبکه عملیاتی و سالم</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Node Telemetry */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 text-[#F7931A] font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>اتصال به RPC نودهای بلاکچین</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className={`p-2.5 rounded-xl border flex justify-between ${
              isDarkMode ? 'bg-black/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <span className={isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}>Polygon RPC (Amoy / Mainnet):</span>
              <span className="text-emerald-500 font-bold">18ms • Sync</span>
            </div>
            <div className={`p-2.5 rounded-xl border flex justify-between ${
              isDarkMode ? 'bg-black/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <span className={isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}>BNB Chain RPC (BSC):</span>
              <span className="text-emerald-500 font-bold">24ms • Sync</span>
            </div>
          </div>
        </div>

        {/* Protocol Fee Configuration */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 text-[#F7931A] font-bold text-sm">
            <Sliders className="w-4 h-4" />
            <span>تنظیم کارمزد پلتفرم (Fee Rate)</span>
          </div>
          <div className="space-y-2">
            <label className={`text-[11px] block ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
              درصد کارمزد پلتفرم از هر صدور و تراکنش:
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.05"
                max="1.50"
                step="0.05"
                value={protocolFeePercent}
                onChange={(e) => setProtocolFeePercent(parseFloat(e.target.value))}
                className="w-full accent-[#F7931A] cursor-pointer"
              />
              <span className="font-mono font-black text-sm text-[#F7931A] w-12 text-left">
                {protocolFeePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Circuit Breaker & Emergency Pause */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>توقف اضطراری قراردادها (Circuit Breaker)</span>
          </div>
          <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            در مواقع بروز نوسان نامتعارف یا حملات مشکوک، تراکنش‌های توکن‌های پلتفرم را موقتاً متوقف کنید.
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className={`text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
              وضعیت کنونی: {emergencyPause ? 'متوقف شده' : 'عادی'}
            </span>
            <button
              onClick={() => setEmergencyPause(!emergencyPause)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                emergencyPause 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                  : isDarkMode ? 'bg-neutral-800 text-neutral-400 hover:text-white' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              {emergencyPause ? 'رفع تعلیق' : 'فعال‌سازی توقف اضطراری'}
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveConfig}
          className="px-6 py-3 rounded-2xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-black text-xs transition-all shadow-lg shadow-[#F7931A]/20 flex items-center gap-2 active:scale-95"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>تنظیمات ذخیره شد</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>ذخیره و اعمال بر قراردادهای هوشمند</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};

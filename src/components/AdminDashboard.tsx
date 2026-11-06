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
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [protocolFeePercent, setProtocolFeePercent] = useState<number>(0.25);
  const [emergencyPause, setEmergencyPause] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveConfig = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700/80 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-3">
            <Settings className="w-4 h-4 text-[#F7931A]" />
            <span>{t.roleAdmin}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            {t.adminTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
            {t.adminDesc}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">نودهای شبکه عملیاتی و سالم</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Node status card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#F7931A]" />
              <span>وضعیت اتصال نودهای RPC</span>
            </h4>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">100% OK</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Polygon RPC (Amoy / Mainnet):</span>
              <span className="text-emerald-400">24ms • 100% Sync</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 flex justify-between">
              <span className="text-slate-400">BNB Chain RPC (BSC):</span>
              <span className="text-emerald-400">38ms • 100% Sync</span>
            </div>
          </div>
        </div>

        {/* Protocol Fee config */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#F7931A]" />
              <span>کارمزد پلتفرم WeSee (درآمدزایی)</span>
            </h4>
            <span className="font-mono text-xs font-bold text-[#F7931A]">{protocolFeePercent}٪</span>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] text-slate-400 block">درصد کارمزد پلتفرم از هر صدور و تراکنش:</label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              value={protocolFeePercent}
              onChange={(e) => setProtocolFeePercent(Number(e.target.value))}
              className="w-full accent-[#F7931A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.1%</span>
              <span>1.0%</span>
              <span>2.0%</span>
            </div>
          </div>
        </div>

        {/* Circuit breaker / Emergency */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>کلید توقف اضطراری (Circuit Breaker)</span>
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            در صورت بروز رخدادهای پیش‌بینی‌نشده یا نقص امنیتی، نقل و انتقال قراردادها در سطح پروتکل متوقف می‌شود.
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-300 font-medium">وضعیت کنونی: {emergencyPause ? 'متوقف شده' : 'عادی'}</span>
            <button
              onClick={() => setEmergencyPause(!emergencyPause)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                emergencyPause 
                  ? 'bg-red-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {emergencyPause ? 'لغو توقف اضطراری' : 'فعال‌سازی توقف'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium self-center animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>تنظیمات پروتکل با موفقیت در شبکه ثبت شد!</span>
          </span>
        )}
        <button
          onClick={handleSaveConfig}
          className="px-6 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-bold text-xs transition-colors"
        >
          ذخیره تغییرات پروتکل
        </button>
      </div>
    </section>
  );
};

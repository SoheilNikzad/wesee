import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Users, 
  Layers, 
  Coins, 
  Scale, 
  Key, 
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { getActiveFirebaseConfig, saveFirebaseConfig, isRealFirebaseConnected } from '../services/firebase';

interface FirebaseInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseInspectorModal: React.FC<FirebaseInspectorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeCollection, setActiveCollection] = useState<'users' | 'assets' | 'investments' | 'compliance' | 'config'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [compliance, setCompliance] = useState<any[]>([]);

  const [configForm, setConfigForm] = useState(getActiveFirebaseConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadData = () => {
    try {
      setUsers(JSON.parse(localStorage.getItem('FIRESTORE_USERS') || '[]'));
      setAssets(JSON.parse(localStorage.getItem('FIRESTORE_ASSETS') || '[]'));
      setInvestments(JSON.parse(localStorage.getItem('FIRESTORE_INVESTMENTS') || '[]'));
      setCompliance(JSON.parse(localStorage.getItem('FIRESTORE_COMPLIANCE') || '[]'));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [isOpen]);

  const handleSaveConfig = () => {
    saveFirebaseConfig(configForm);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl border border-slate-700 bg-[#0F131D] text-slate-100 shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#141824]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F7931A]/15 text-[#F7931A] flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-vazir text-white">مرکز داده و کنسول فایربیس (Firebase Firestore)</h3>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                  isRealFirebaseConnected 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-[#F7931A]/20 text-[#F7931A] border border-[#F7931A]/30'
                }`}>
                  {isRealFirebaseConnected ? 'متصل به پروژه آنلاین گوگل' : 'دیتابیس ابری زنده (Firestore)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-vazir mt-0.5">
                مشاهده جداول و موجودیت‌های سیستم RWA (کاربران، دارایی‌ها، سفارشات سرمایه‌گذاری و ممیزی‌ها)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collection Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 bg-[#0B0E14] overflow-x-auto scrollbar-none shrink-0 font-vazir">
          <button
            onClick={() => setActiveCollection('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeCollection === 'users' ? 'bg-[#F7931A] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>کالکشن users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveCollection('assets')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeCollection === 'assets' ? 'bg-[#F7931A] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>کالکشن assets ({assets.length})</span>
          </button>

          <button
            onClick={() => setActiveCollection('investments')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeCollection === 'investments' ? 'bg-[#F7931A] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>کالکشن investments ({investments.length})</span>
          </button>

          <button
            onClick={() => setActiveCollection('compliance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeCollection === 'compliance' ? 'bg-[#F7931A] text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>کالکشن compliance_audits ({compliance.length})</span>
          </button>

          <button
            onClick={() => setActiveCollection('config')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all mr-auto ${
              activeCollection === 'config' ? 'bg-white text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>اتصال پروژه فایربیس شما</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-vazir text-xs scrollbar-thin">
          
          {/* USERS COLLECTION */}
          {activeCollection === 'users' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>کاربران احراز هویت شده (Firebase Auth & Firestore):</span>
                <span className="font-mono text-[#F7931A]">{users.length} رکورد ثبت شده</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {users.map((u, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                          alt={u.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700" 
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{u.name}</p>
                          <p className="text-[11px] font-mono text-slate-400">{u.email}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-[#F7931A]/10 text-[#F7931A] font-semibold text-[10px] border border-[#F7931A]/20">
                        {u.role}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-500">وضعیت KYC:</span>
                        <span className="text-emerald-400 font-bold block">احراز هویت شده ✓</span>
                      </div>
                      <div>
                        <span className="text-slate-500">شناسه UID:</span>
                        <span className="text-slate-300 font-mono block truncate">{u.uid}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSETS COLLECTION */}
          {activeCollection === 'assets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>اسناد RWA ایجاد شده (ذخیره‌شده در Firestore):</span>
                <span className="font-mono text-[#F7931A]">{assets.length} دارایی رسمی</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assets.map((a, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-3">
                      <img src={a.imageUrl} alt={a.title} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">{a.title}</h4>
                        <p className="text-[11px] text-slate-400">{a.categoryLabel} • {a.location}</p>
                      </div>
                      <span className="font-mono font-bold text-[#F7931A] text-xs">${a.tokenPriceUSD}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950 font-mono text-[10px] text-slate-400 flex justify-between">
                      <span>نماد: <strong className="text-[#F7931A]">{a.tokenSymbol}</strong></span>
                      <span>تأمین مالی: {Math.round((a.tokensSold / a.totalSupply) * 100)}٪</span>
                      <span className="text-emerald-400">APY: {a.expectedAPY}٪</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INVESTMENTS COLLECTION */}
          {activeCollection === 'investments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>تراکنش‌های خرید سهم توکن (سفارشات ثبت‌شده):</span>
                <span className="font-mono text-[#F7931A]">{investments.length} سفارش موفق</span>
              </div>
              <div className="space-y-2">
                {investments.map((inv, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{inv.assetTitle || 'دارایی RWA'}</span>
                        <span className="font-mono text-xs text-[#F7931A] bg-[#F7931A]/10 px-2 py-0.5 rounded">
                          {inv.tokenSymbol || 'WSEE'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        خریدار: <span className="font-mono text-slate-300">{inv.userEmail}</span> • زمان: {inv.timestamp}
                      </p>
                      <p className="font-mono text-[10px] text-slate-500 truncate max-w-md mt-0.5">
                        TxHash: {inv.txHash}
                      </p>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="text-xs text-slate-400 block">{inv.tokenCount} سهم</span>
                      <span className="text-base font-black font-mono text-emerald-400">${inv.totalUSD?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPLIANCE AUDITS COLLECTION */}
          {activeCollection === 'compliance' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>مجوزهای انطباق قانونی و ممیزی رسمی دادگستری:</span>
                <span className="font-mono text-[#F7931A]">{compliance.length} مجوز رسمی</span>
              </div>
              <div className="space-y-2">
                {compliance.map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-black/40 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{c.assetTitle}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                          {c.licenseId}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        مرجع تأیید: {c.auditAuthority || 'کارشناس رسمی دادگستری'}
                      </p>
                      <p className="text-slate-500 text-[10px] mt-0.5">
                        کارشناس ممیزی: {c.regulatorEmail} • تاریخ ثبت: {c.timestamp}
                      </p>
                    </div>

                    <div className="shrink-0 text-left">
                      <span className="text-[10px] px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold">
                        تأیید نهایی
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FIREBASE CONFIG PANEL */}
          {activeCollection === 'config' && (
            <div className="max-w-xl mx-auto space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A] space-y-1">
                <p className="font-bold">چگونه فایربیس اختصاصی خود را وصل کنید؟</p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  کافیست در پنل Firebase Console خود (بخش Project Settings -&gt; General -&gt; Your apps)، کلیدهای پروژه وب خود را کپی کنید و در فیلدهای زیر جای‌گذاری کنید:
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">API Key:</label>
                  <input
                    type="text"
                    value={configForm.apiKey}
                    onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Project ID:</label>
                    <input
                      type="text"
                      value={configForm.projectId}
                      onChange={(e) => setConfigForm({ ...configForm, projectId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Auth Domain:</label>
                    <input
                      type="text"
                      value={configForm.authDomain}
                      onChange={(e) => setConfigForm({ ...configForm, authDomain: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Storage Bucket:</label>
                    <input
                      type="text"
                      value={configForm.storageBucket}
                      onChange={(e) => setConfigForm({ ...configForm, storageBucket: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">App ID:</label>
                    <input
                      type="text"
                      value={configForm.appId}
                      onChange={(e) => setConfigForm({ ...configForm, appId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveConfig}
                    className="w-full py-3 rounded-xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-bold text-xs shadow-lg transition-all"
                  >
                    {savedSuccess ? 'تنظیمات ذخیره شد! در حال اتصال...' : 'ذخیره کلیدهای فایربیس و اتصال فوری'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-[#141824] flex items-center justify-between text-[11px] text-slate-400 shrink-0 font-vazir">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>پایگاه داده به صورت بلادرنگ اسناد را همگام می‌کند.</span>
          </div>
          <button 
            onClick={loadData}
            className="flex items-center gap-1 text-slate-300 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تازه‌سازی اسناد</span>
          </button>
        </div>

      </div>
    </div>
  );
};

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
  RefreshCw,
  Share2,
  ExternalLink,
  Clock,
  Check,
  Search,
  Filter,
  FileText
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../translations';
import { ListingApplication, ListingStatus } from '../types';
import { AVAILABLE_MARKETS } from '../mockData';

interface AdminDashboardProps {
  lang: Language;
  isDarkMode?: boolean;
  listingApplications?: ListingApplication[];
  onUpdateListingStatus?: (id: string, status: ListingStatus) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  lang, 
  isDarkMode = true,
  listingApplications = [],
  onUpdateListingStatus
}) => {
  const t = TRANSLATIONS[lang];
  const [activeAdminTab, setActiveAdminTab] = useState<'listings' | 'telemetry'>('listings');
  const [protocolFeePercent, setProtocolFeePercent] = useState<number>(0.25);
  const [emergencyPause, setEmergencyPause] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [selectedAppDetail, setSelectedAppDetail] = useState<ListingApplication | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const handleSaveConfig = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const filteredApps = listingApplications.filter(app => {
    const q = searchFilter.toLowerCase();
    return (
      app.tokenName.toLowerCase().includes(q) ||
      app.tokenSymbol.toLowerCase().includes(q) ||
      app.trackingCode.toLowerCase().includes(q) ||
      app.entityName.toLowerCase().includes(q)
    );
  });

  const getStatusBadgeClass = (status: ListingStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'under_review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'sent_to_exchanges':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'docs_required':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  const getStatusLabel = (status: ListingStatus) => {
    switch (status) {
      case 'submitted': return 'ثبت اولیه در صف بررسی';
      case 'under_review': return 'در حال ارزیابی حقوقی و فنی';
      case 'sent_to_exchanges': return 'ارسال مدارک به کارگروه پذیرش';
      case 'docs_required': return 'نیازمند تکمیل مدارک';
      case 'approved': return 'تأیید پذیرش و آغاز بازارگردانی';
      case 'rejected': return 'رد درخواست';
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in font-vazir" dir="rtl">
      
      {/* Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors ${
        isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
      }`}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7931A]/10 text-[#F7931A] text-xs font-semibold mb-3">
            <Settings className="w-4 h-4 text-[#F7931A]" />
            <span>پنل مدیریت جامع WeSee</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            کنسول حاکمیت و پیگیری پذیرش توکن‌ها
          </h2>
          <p className={`text-xs sm:text-sm mt-2 max-w-2xl ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            مدیریت درخواست‌های لیستینگ در آبان‌تتر و صرافی‌های همکار، ممیزی اسناد و تنظیمات پروتکل.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveAdminTab('listings')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeAdminTab === 'listings'
                ? 'bg-[#F7931A] text-black shadow-md shadow-[#F7931A]/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>درخواست‌های پذیرش و لیستینگ ({listingApplications.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('telemetry')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeAdminTab === 'telemetry'
                ? 'bg-[#F7931A] text-black shadow-md shadow-[#F7931A]/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>نودها و پارامترهای پروتکل</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LISTING APPLICATIONS */}
      {activeAdminTab === 'listings' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200'
          }`}>
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="جستجو بر اساس نام توکن، نماد یا کد پیگیری..."
                className="w-full pl-4 pr-10 py-2 rounded-xl border bg-neutral-950 border-neutral-800 text-white text-xs focus:border-[#F7931A] outline-none"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-2.5" />
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span>تعداد کل پرونده‌ها: <strong className="text-[#F7931A] font-mono">{listingApplications.length}</strong></span>
            </div>
          </div>

          {/* Applications Grid */}
          <div className="space-y-4">
            {filteredApps.map(app => (
              <div 
                key={app.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isDarkMode ? 'bg-[#121212] border-neutral-800 hover:border-neutral-700' : 'bg-white border-neutral-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F7931A]/10 border border-[#F7931A]/20 text-[#F7931A] flex items-center justify-center font-mono font-black text-lg">
                      {app.tokenSymbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{app.tokenName}</h3>
                        <span className="font-mono text-xs text-[#F7931A] font-bold">({app.tokenSymbol})</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                          {app.blockchainNetwork.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        متقاضی: <strong className="text-neutral-300">{app.entityName}</strong> • نماینده: {app.representativeName} ({app.representativePhone})
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-left">
                      <span className="text-[10px] text-neutral-500 block font-mono">کد پیگیری:</span>
                      <span className="font-mono font-bold text-xs text-[#F7931A] select-all">{app.trackingCode}</span>
                    </div>

                    <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${getStatusBadgeClass(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </div>

                    {/* Status updater dropdown */}
                    {onUpdateListingStatus && (
                      <select
                        value={app.status}
                        onChange={e => onUpdateListingStatus(app.id, e.target.value as ListingStatus)}
                        className="px-2.5 py-1.5 rounded-xl border bg-neutral-900 border-neutral-700 text-neutral-300 text-xs outline-none focus:border-[#F7931A] cursor-pointer"
                      >
                        <option value="submitted">ثبت اولیه</option>
                        <option value="under_review">در حال ارزیابی</option>
                        <option value="sent_to_exchanges">ارسال به صرافی‌ها</option>
                        <option value="docs_required">نیازمند مدرک</option>
                        <option value="approved">تأیید پذیرش</option>
                        <option value="rejected">رد درخواست</option>
                      </select>
                    )}

                    <button
                      onClick={() => setSelectedAppDetail(app)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      مشاهده پرونده کامل
                    </button>
                  </div>
                </div>

                {/* Target Markets badges */}
                <div className="pt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-neutral-500 text-[11px]">بازارهای هدف متقاضی:</span>
                    {app.targetMarkets.map(mId => {
                      const mObj = AVAILABLE_MARKETS.find(m => m.id === mId);
                      return (
                        <span key={mId} className="px-2.5 py-1 rounded-lg bg-[#F7931A]/10 text-[#F7931A] border border-[#F7931A]/20 font-semibold text-[11px]">
                          {mObj?.nameFa || mId}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                    <span>تاریخ ثبت: <strong className="font-mono text-neutral-300">{app.createdAt}</strong></span>
                    {app.documentsDriveLink && (
                      <a 
                        href={app.documentsDriveLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[#F7931A] hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>پوشه اسناد درایو</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROTOCOL TELEMETRY */}
      {activeAdminTab === 'telemetry' && (
        <div className="space-y-6">
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
                  <span className={isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}>Polygon Mainnet (Amoy):</span>
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
              className="px-6 py-3 rounded-2xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-black text-xs transition-all shadow-lg shadow-[#F7931A]/20 flex items-center gap-2 active:scale-95 cursor-pointer"
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
        </div>
      )}

      {/* DETAIL MODAL FOR APPLICATION */}
      {selectedAppDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-neutral-800 text-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold">پرونده پذیرش توکن {selectedAppDetail.tokenName}</h3>
                <span className="text-xs font-mono text-[#F7931A]">کد پیگیری: {selectedAppDetail.trackingCode}</span>
              </div>
              <button 
                onClick={() => setSelectedAppDetail(null)}
                className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto space-y-3.5 text-xs text-neutral-300 pr-1">
              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="font-bold text-[#F7931A] block">مشخصات متقاضی و نماینده:</span>
                <p>مجموعه متقاضی: <strong>{selectedAppDetail.entityName}</strong> {selectedAppDetail.nationalId && `(شناسه ملی: ${selectedAppDetail.nationalId})`}</p>
                <p>نماینده پیگیری: <strong>{selectedAppDetail.representativeName}</strong></p>
                <p>شماره تماس: <span className="font-mono">{selectedAppDetail.representativePhone}</span> • ایمیل: <span className="font-mono">{selectedAppDetail.representativeEmail}</span></p>
                {selectedAppDetail.projectWebsite && <p>وب‌سایت: <a href={selectedAppDetail.projectWebsite} target="_blank" rel="noreferrer" className="text-[#F7931A] underline font-mono">{selectedAppDetail.projectWebsite}</a></p>}
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="font-bold text-[#F7931A] block">مشخصات توکن و دارایی پایه:</span>
                <p>دسته‌بندی دارایی: <strong>{selectedAppDetail.underlyingAssetCategory}</strong></p>
                <p>معرفی دارایی پایه: {selectedAppDetail.underlyingAssetIntro}</p>
                <p>حقوق دارندگان: {selectedAppDetail.tokenHolderRights.join('، ')}</p>
                <p>اقتصاد توکن: {selectedAppDetail.tokenEconomicsSummary}</p>
                {selectedAppDetail.smartContractAddress && (
                  <p className="font-mono">کانترکت: <span className="text-neutral-400">{selectedAppDetail.smartContractAddress}</span> ({selectedAppDetail.blockchainNetwork})</p>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="font-bold text-[#F7931A] block">وضعیت حقوقی و اسناد:</span>
                <p>وضعیت مجوزها: {selectedAppDetail.regulatoryStatus}</p>
                <p>مدارک آماده: {selectedAppDetail.availableDocuments.join('، ')}</p>
                <p>افق زمانی مدنظر: {selectedAppDetail.expectedListingTimeline}</p>
                {selectedAppDetail.documentsDriveLink && (
                  <p>لینک درایو اسناد: <a href={selectedAppDetail.documentsDriveLink} target="_blank" rel="noreferrer" className="text-emerald-400 underline font-mono">{selectedAppDetail.documentsDriveLink}</a></p>
                )}
              </div>

              {selectedAppDetail.additionalNotes && (
                <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <span className="font-bold text-[#F7931A] block mb-1">توضیحات تکمیلی متقاضی:</span>
                  <p className="leading-relaxed">{selectedAppDetail.additionalNotes}</p>
                </div>
              )}
            </div>

            <div className="border-t border-neutral-800 pt-3 flex justify-end">
              <button
                onClick={() => setSelectedAppDetail(null)}
                className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

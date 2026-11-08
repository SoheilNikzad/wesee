import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Building2, 
  Coins, 
  FileText, 
  Scale, 
  ExternalLink,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Share2,
  Sparkles,
  Info
} from 'lucide-react';
import { AVAILABLE_MARKETS } from '../mockData';
import { TargetMarket, MarketType, ListingApplication } from '../types';

interface ListingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationCreated: (app: ListingApplication) => void;
  isDarkMode: boolean;
}

export const ListingWizard: React.FC<ListingWizardProps> = ({
  isOpen,
  onClose,
  onApplicationCreated,
  isDarkMode
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Step 1: Selected Markets
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['abantether', 'coinex', 'uniswap']);
  const [marketTab, setMarketTab] = useState<MarketType | 'all'>('all');

  // Step 2: Applicant Info
  const [requestTopic, setRequestTopic] = useState('پذیرش توکن منتشرشده در بازار آبان و سایر بازارها');
  const [applicantRole, setApplicantRole] = useState('ناشر توکن');
  const [entityName, setEntityName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [representativePhone, setRepresentativePhone] = useState('');
  const [representativeEmail, setRepresentativeEmail] = useState('');
  const [projectWebsite, setProjectWebsite] = useState('');

  // Step 3: Token & Asset Specs
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenCurrentStatus, setTokenCurrentStatus] = useState('منتشر شده و در حال معامله است');
  const [underlyingAssetCategory, setUnderlyingAssetCategory] = useState('املاک و مستغلات');
  const [underlyingAssetIntro, setUnderlyingAssetIntro] = useState('');
  const [tokenHolderRights, setTokenHolderRights] = useState<string[]>([
    'مالکیت تمام یا بخشی از دارایی',
    'سهم از درآمد یا منافع اقتصادی'
  ]);
  const [assetOwnerOrObligor, setAssetOwnerOrObligor] = useState('');
  const [ownershipProofStatus, setOwnershipProofStatus] = useState('بله');
  const [tokenEconomicsSummary, setTokenEconomicsSummary] = useState('');
  const [blockchainNetwork, setBlockchainNetwork] = useState('polygon');
  const [smartContractAddress, setSmartContractAddress] = useState('');

  // Step 4: Legal & Readiness
  const [regulatoryStatus, setRegulatoryStatus] = useState('مجوز یا تأییدیه مرتبط دریافت شده است');
  const [availableDocuments, setAvailableDocuments] = useState<string[]>([
    'معرفی‌نامه یا طرح تجاری پروژه',
    'سپیدنامه (Whitepaper)',
    'اسناد مالکیت یا حقوق دارایی پایه'
  ]);
  const [documentsDriveLink, setDocumentsDriveLink] = useState('');
  const [expectedListingTimeline, setExpectedListingTimeline] = useState('هم‌اکنون آماده بررسی هستیم');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Step 5: Terms
  const [termsConfirmed, setTermsConfirmed] = useState(false);

  if (!isOpen) return null;

  const toggleMarket = (id: string) => {
    setSelectedMarkets(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const toggleRight = (right: string) => {
    setTokenHolderRights(prev => 
      prev.includes(right) ? prev.filter(r => r !== right) : [...prev, right]
    );
  };

  const toggleDoc = (doc: string) => {
    setAvailableDocuments(prev => 
      prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
    );
  };

  const filteredMarkets = AVAILABLE_MARKETS.filter(m => {
    if (marketTab === 'all') return true;
    return m.type === marketTab;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsConfirmed) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const tracking = `LST-WSEE-${randomNum}`;

    const newApp: ListingApplication = {
      id: `lst-${Date.now()}`,
      trackingCode: tracking,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      status: 'submitted',
      statusLabelFa: 'ثبت اولیه پرونده در صف بررسی',
      targetMarkets: selectedMarkets,
      requestTopic,
      applicantRole,
      entityName: entityName || 'شرکت متقاضی پذیرش توکن',
      nationalId,
      representativeName: representativeName || 'نماینده رسمی پروژه',
      representativePhone,
      representativeEmail,
      projectWebsite: projectWebsite || 'https://wesee.ir',
      tokenName: tokenName || 'توکن RWA پیشنهادی',
      tokenSymbol: (tokenSymbol || 'TKN').toUpperCase(),
      tokenCurrentStatus,
      underlyingAssetCategory,
      underlyingAssetIntro,
      tokenHolderRights,
      assetOwnerOrObligor: assetOwnerOrObligor || entityName,
      ownershipProofStatus,
      tokenEconomicsSummary,
      blockchainNetwork,
      smartContractAddress,
      regulatoryStatus,
      availableDocuments,
      documentsDriveLink,
      expectedListingTimeline,
      additionalNotes,
      termsConfirmed
    };

    onApplicationCreated(newApp);
    setGeneratedCode(tracking);
    setIsSuccess(true);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-vazir" dir="rtl">
      <div className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden transition-all my-8 ${
        isDarkMode ? 'bg-[#121212] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${
          isDarkMode ? 'border-neutral-800 bg-[#161616]' : 'border-neutral-200 bg-neutral-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center border border-[#F7931A]/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black">درخواست پذیرش و لیستینگ توکن در صرافی‌ها</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F7931A]/20 text-[#F7931A] font-bold border border-[#F7931A]/30">
                  آبان‌تتر • CEX • DEX
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                معرفی توکن منتشرشده به بازارهای متمرکز و غیرمتمرکز، تجمیع اسناد و آغاز سیکل رسمی پذیرش
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-200 text-neutral-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Modal View */}
        {isSuccess ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-5 border border-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-white">پرونده پذیرش توکن با موفقیت تشکیل شد!</h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto mb-6 leading-relaxed">
              اطلاعات توکن و مدارک حقوقی شما جهت ارزیابی به کارگروه پذیرش صرافی‌های منتخب ارسال گردید.
            </p>

            <div className={`max-w-md mx-auto p-4 rounded-2xl border mb-6 text-center ${
              isDarkMode ? 'bg-neutral-900/90 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <span className="text-xs text-neutral-400 block mb-1">کد اختصاصی پیگیری پرونده:</span>
              <span className="text-2xl font-black font-mono text-[#F7931A] tracking-wider select-all">{generatedCode}</span>
              <p className="text-[11px] text-neutral-500 mt-2">
                تیم حقوقی و انطباق WeSee ظرف حداکثر ۳ روز کاری جهت تکمیل فرآیند اداری با نماینده شما تماس خواهند گرفت.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={resetAndClose}
                className="px-8 py-3 rounded-2xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-black text-xs shadow-lg shadow-[#F7931A]/20 transition-all cursor-pointer"
              >
                مشاهده و بستن
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step Indicator */}
            <div className={`px-6 py-3 border-b flex items-center justify-between text-xs overflow-x-auto scrollbar-none ${
              isDarkMode ? 'border-neutral-800 bg-[#141414]' : 'border-neutral-200 bg-neutral-100/50'
            }`}>
              {[
                { s: 1, label: '۱. انتخاب بازارها' },
                { s: 2, label: '۲. مشخصات متقاضی' },
                { s: 3, label: '۳. مشخصات توکن' },
                { s: 4, label: '۴. اسناد و حقوقی' },
                { s: 5, label: '۵. تعهد و ارسال' }
              ].map(st => (
                <div 
                  key={st.s}
                  onClick={() => step > st.s && setStep(st.s)}
                  className={`flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    step === st.s
                      ? 'bg-[#F7931A] text-black font-bold shadow-md shadow-[#F7931A]/20'
                      : step > st.s
                      ? 'text-emerald-400 hover:text-emerald-300 font-semibold'
                      : isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                >
                  <span>{st.label}</span>
                </div>
              ))}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 max-h-[68vh] overflow-y-auto space-y-6">

              {/* STEP 1: TARGET MARKETS */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">بازارهای هدف برای درخواست پذیرش</h4>
                      <p className="text-xs text-neutral-400">
                        متقاضی می‌تواند به صورت همزمان برای یک یا چند بازار ایرانی، بین‌المللی و غیرمتمرکز درخواست ارسال کند.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                      {(['all', 'iran-cex', 'global-cex', 'dex'] as const).map(tabKey => (
                        <button
                          key={tabKey}
                          type="button"
                          onClick={() => setMarketTab(tabKey)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            marketTab === tabKey 
                              ? 'bg-[#F7931A] text-black font-bold shadow-xs' 
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {tabKey === 'all' && 'همه'}
                          {tabKey === 'iran-cex' && 'اکسچنج ایران'}
                          {tabKey === 'global-cex' && 'اکسچنج خارجی'}
                          {tabKey === 'dex' && 'DEX غیرمتمرکز'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredMarkets.map(market => {
                      const isSelected = selectedMarkets.includes(market.id);
                      return (
                        <div
                          key={market.id}
                          onClick={() => toggleMarket(market.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                            isSelected
                              ? 'bg-[#F7931A]/10 border-[#F7931A] shadow-lg shadow-[#F7931A]/5 ring-1 ring-[#F7931A]/30'
                              : isDarkMode 
                              ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700' 
                              : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{market.nameFa}</span>
                              <span className="text-[11px] font-mono text-neutral-400">({market.name})</span>
                            </div>
                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                              isSelected ? 'bg-[#F7931A] border-[#F7931A] text-black' : 'border-neutral-700'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
                              {market.badge}
                            </span>
                            {market.popular && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F7931A]/20 text-[#F7931A] font-bold">
                                منتخب ناشران
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] leading-relaxed text-neutral-400">
                            {market.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-neutral-400">تعداد بازارهای انتخاب‌شده:</span>
                    <span className="font-bold text-[#F7931A] font-mono text-sm">{selectedMarkets.length} بازار</span>
                  </div>
                </div>
              )}

              {/* STEP 2: APPLICANT INFO */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="border-b border-neutral-800 pb-3">
                    <h4 className="text-base font-bold text-white mb-1">بخش اول: مشخصات متقاضی و نماینده حقوقی</h4>
                    <p className="text-xs text-neutral-400">اطلاعات این بخش برای پیگیری رسمی، احراز هویت و مکاتبات اداری با صرافی‌ها استفاده خواهد شد.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۱. موضوع درخواست شما چیست؟</label>
                      <select
                        value={requestTopic}
                        onChange={e => setRequestTopic(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                      >
                        <option value="پذیرش توکن منتشرشده در بازار آبان و سایر بازارها">پذیرش توکن منتشرشده در بازارها</option>
                        <option value="پذیرش توکن در حال انتشار یا آماده انتشار">پذیرش توکن در حال انتشار یا آماده انتشار</option>
                        <option value="درخواست خدمات توکن‌سازی و انتشار، همراه با بررسی امکان پذیرش">درخواست خدمات توکن‌سازی همزمان با لیستینگ</option>
                        <option value="بررسی اولیه ایده یا پروژه توکن‌سازی">بررسی اولیه ایده یا مشاوره پذیرش</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۲. نقش شما در پروژه چیست؟</label>
                      <select
                        value={applicantRole}
                        onChange={e => setApplicantRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                      >
                        <option value="ناشر توکن">ناشر توکن (Token Issuer)</option>
                        <option value="مالک دارایی یا حق پایه">مالک دارایی یا حق پایه (Asset Owner)</option>
                        <option value="نماینده قانونی یا قراردادی پروژه">نماینده قانونی یا قراردادی پروژه</option>
                        <option value="ارائه‌دهنده خدمات توکن‌سازی">ارائه‌دهنده خدمات توکن‌سازی</option>
                        <option value="سایر">سایر</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۳. نام شخص حقوقی یا مجموعه متقاضی *</label>
                      <input
                        type="text"
                        required
                        value={entityName}
                        onChange={e => setEntityName(e.target.value)}
                        placeholder="مثال: شرکت توسعه و عمران مهرگان / هلدینگ طلای شمس"
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۴. شناسه ملی شخص حقوقی (در صورت ثبت)</label>
                      <input
                        type="text"
                        value={nationalId}
                        onChange={e => setNationalId(e.target.value)}
                        placeholder="شناسه ملی ۱۱ رقمی شرکت"
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۵. نام و سمت نماینده پیگیری *</label>
                      <input
                        type="text"
                        required
                        value={representativeName}
                        onChange={e => setRepresentativeName(e.target.value)}
                        placeholder="مثال: دکتر علیرضا محمدی - مدیر سرمایه‌گذاری"
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۶. شماره تلفن همراه نماینده *</label>
                      <input
                        type="tel"
                        required
                        value={representativePhone}
                        onChange={e => setRepresentativePhone(e.target.value)}
                        placeholder="0912..."
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۷. نشانی رایانامه (ایمیل) نماینده *</label>
                      <input
                        type="email"
                        required
                        value={representativeEmail}
                        onChange={e => setRepresentativeEmail(e.target.value)}
                        placeholder="invest@company.ir"
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۸. وب‌سایت یا صفحه رسمی پروژه</label>
                      <input
                        type="url"
                        value={projectWebsite}
                        onChange={e => setProjectWebsite(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: TOKEN & UNDERLYING ASSET */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="border-b border-neutral-800 pb-3">
                    <h4 className="text-base font-bold text-white mb-1">بخش دوم: مشخصات توکن و دارایی پایه</h4>
                    <p className="text-xs text-neutral-400">جزئیات فنی اسمارت‌کانترکت، دارایی پشتوانه و حقوق ناشی از تملک توکن.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۹. نام توکن و نماد (Symbol / Ticker) *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={tokenName}
                          onChange={e => setTokenName(e.target.value)}
                          placeholder="نام توکن (مثلاً آسمان فرشته)"
                          className="px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                        />
                        <input
                          type="text"
                          required
                          value={tokenSymbol}
                          onChange={e => setTokenSymbol(e.target.value)}
                          placeholder="نماد (مثلاً WSEE-FST)"
                          className="px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۱۰. وضعیت فعلی توکن چیست؟</label>
                      <select
                        value={tokenCurrentStatus}
                        onChange={e => setTokenCurrentStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                      >
                        <option value="منتشر شده و در حال معامله است">منتشر شده و در حال معامله است</option>
                        <option value="منتشر شده، اما هنوز در بازاری معامله نمی‌شود">منتشر شده، اما هنوز در بازاری معامله نمی‌شود</option>
                        <option value="طراحی شده و آماده انتشار است">طراحی شده و آماده انتشار است</option>
                        <option value="در مرحله طراحی و توسعه است">در مرحله طراحی و توسعه است</option>
                        <option value="هنوز توکنی تعریف نشده است">هنوز توکنی تعریف نشده است</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۱۱. دسته‌بندی دارایی یا حق پایه</label>
                      <select
                        value={underlyingAssetCategory}
                        onChange={e => setUnderlyingAssetCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                      >
                        <option value="املاک و مستغلات">املاک و مستغلات تجاری و مسکونی</option>
                        <option value="کالاها، فلزات و مواد اولیه">کالاها، شمش طلا و فلزات گرانبها</option>
                        <option value="انرژی، برق و حامل‌های انرژی">انرژی، نیروگاه خورشیدی و برق تجدیدپذیر</option>
                        <option value="سهام، مشارکت و سرمایه‌گذاری">سهام، مشارکت و سرمایه‌گذاری شرکتی</option>
                        <option value="مطالبات، بدهی‌ها و حقوق مالی">مطالبات، بدهی‌ها و حقوق مالی</option>
                        <option value="درآمد یا منافع آتی پروژه">درآمد یا منافع آتی پروژه‌ها</option>
                        <option value="سایر دارایی‌ها یا حقوق">سایر دارایی‌ها یا حقوق قراردادی</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">شبکه بلاکچین و نشانی قرارداد هوشمند</label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={blockchainNetwork}
                          onChange={e => setBlockchainNetwork(e.target.value)}
                          className="px-2.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none font-mono"
                        >
                          <option value="polygon">Polygon</option>
                          <option value="bsc">BNB Chain</option>
                          <option value="arbitrum">Arbitrum</option>
                          <option value="ethereum">Ethereum</option>
                        </select>
                        <input
                          type="text"
                          value={smartContractAddress}
                          onChange={e => setSmartContractAddress(e.target.value)}
                          placeholder="0x... نشانی کانترکت"
                          className="col-span-2 px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                      <label className="font-semibold text-neutral-300">۱۲. معرفی مختصر دارایی یا حق پایه پروژه *</label>
                      <textarea
                        required
                        rows={2}
                        value={underlyingAssetIntro}
                        onChange={e => setUnderlyingAssetIntro(e.target.value)}
                        placeholder="متراژ، مشخصات ثبتی، کاربری، وضعیت فیزیکی و موقعیت استقرار دارایی را مختصراً شرح دهید..."
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none resize-none"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="font-semibold text-neutral-300">۱۳. دارنده توکن چه حقی دریافت می‌کند؟ (چند انتخابی)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          'مالکیت تمام یا بخشی از دارایی',
                          'سهم از درآمد یا منافع اقتصادی',
                          'طلب یا حق دریافت وجه',
                          'حق دریافت کالا یا خدمت',
                          'حق بازخرید یا تسویه طبق قرارداد',
                          'حق مشارکت یا سایر حقوق قراردادی'
                        ].map(right => (
                          <div
                            key={right}
                            onClick={() => toggleRight(right)}
                            className={`p-2.5 rounded-xl border text-[11px] cursor-pointer flex items-center gap-2 transition-all ${
                              tokenHolderRights.includes(right)
                                ? 'bg-[#F7931A]/10 border-[#F7931A] text-white'
                                : 'bg-neutral-900/50 border-neutral-800 text-neutral-400'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              tokenHolderRights.includes(right) ? 'bg-[#F7931A] border-[#F7931A] text-black' : 'border-neutral-700'
                            }`}>
                              {tokenHolderRights.includes(right) && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="truncate">{right}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۱۴. مالک دارایی پایه یا متعهد اصلی ایفای حقوق کیست؟</label>
                      <input
                        type="text"
                        value={assetOwnerOrObligor}
                        onChange={e => setAssetOwnerOrObligor(e.target.value)}
                        placeholder="نام شخص حقیقی یا حقوقی صاحب سند"
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۱۵. آیا مدارک اثبات مالکیت موجود است؟</label>
                      <select
                        value={ownershipProofStatus}
                        onChange={e => setOwnershipProofStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                      >
                        <option value="بله">بله، اسناد رسمی تک‌برگ / بنچاق موجود است</option>
                        <option value="بخشی از مدارک موجود است">بخشی از مدارک موجود است</option>
                        <option value="در حال تهیه مدارک هستیم">در حال تهیه و تکمیل مدارک هستیم</option>
                        <option value="خیر / هنوز مشخص نیست">خیر / هنوز مشخص نیست</option>
                      </select>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                      <label className="font-semibold text-neutral-300">۱۶. اطلاعات اقتصادی اولیه توکن (تعداد، ارزش کل، منبع درآمد)</label>
                      <input
                        type="text"
                        value={tokenEconomicsSummary}
                        onChange={e => setTokenEconomicsSummary(e.target.value)}
                        placeholder="مثال: ارزش دارایی ۱.۵ میلیون دلار، ۵۰ هزار توکن با ارزش اسمی ۳۰ دلار، درآمد ماهانه ناشی از اجاره"
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: LEGAL & READINESS */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="border-b border-neutral-800 pb-3">
                    <h4 className="text-base font-bold text-white mb-1">بخش سوم: وضعیت حقوقی و آمادگی پذیرش</h4>
                    <p className="text-xs text-neutral-400">ارزیابی انطباق قانونی، اسناد در دسترس و برنامه‌ریزی زمان‌بندی ورود به صرافی‌ها.</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۱۸. وضعیت مجوزها و بررسی‌های قانونی پروژه چیست؟</label>
                      <select
                        value={regulatoryStatus}
                        onChange={e => setRegulatoryStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                      >
                        <option value="مجوز یا تأییدیه مرتبط دریافت شده است">مجوز یا تأییدیه مرتبط دریافت شده است</option>
                        <option value="در محیط آزمون تنظیم‌گری (Sandbox) قرار دارد">در محیط آزمون تنظیم‌گری (Sandbox) قرار دارد</option>
                        <option value="درخواست ثبت، مجوز یا استعلام ارائه شده است">درخواست ثبت، مجوز یا استعلام ارائه شده است</option>
                        <option value="بررسی حقوقی انجام شده ولی تأییدیه رسمی دریافت نشده است">بررسی حقوقی انجام شده ولی تأییدیه رسمی دریافت نشده است</option>
                        <option value="هنوز بررسی نشده است">هنوز بررسی نشده است</option>
                        <option value="نامشخص / سایر">نامشخص / سایر</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="font-semibold text-neutral-300">۱۹. کدام‌یک از مدارک زیر هم‌اکنون در دسترس است؟</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          'معرفی‌نامه یا طرح تجاری پروژه',
                          'سپیدنامه (Whitepaper)',
                          'اسناد مالکیت یا حقوق دارایی پایه',
                          'اسناد ثبتی و حقوقی ناشر',
                          'گزارش ارزش‌گذاری یا پشتوانه',
                          'قراردادهای مرتبط با حقوق دارندگان',
                          'مستندات فنی یا قرارداد هوشمند',
                          'گزارش ممیزی امنیتی',
                          'مکاتبات یا تأییدیه‌های تنظیم‌گری'
                        ].map(doc => (
                          <div
                            key={doc}
                            onClick={() => toggleDoc(doc)}
                            className={`p-2.5 rounded-xl border text-[11px] cursor-pointer flex items-center gap-2 transition-all ${
                              availableDocuments.includes(doc)
                                ? 'bg-[#F7931A]/10 border-[#F7931A] text-white'
                                : 'bg-neutral-900/50 border-neutral-800 text-neutral-400'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              availableDocuments.includes(doc) ? 'bg-[#F7931A] border-[#F7931A] text-black' : 'border-neutral-700'
                            }`}>
                              {availableDocuments.includes(doc) && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="truncate">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۲۰. پیوند پوشه اسناد معرفی پروژه (گوگل درایو / فضای ابری)</label>
                      <input
                        type="url"
                        value={documentsDriveLink}
                        onChange={e => setDocumentsDriveLink(e.target.value)}
                        placeholder="https://drive.google.com/drive/folders/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none font-mono"
                      />
                      <p className="text-[10px] text-neutral-500">
                        لطفاً فعلاً فقط پیوند اسناد قابل اشتراک‌گذاری را وارد کنید. مدارک محرمانه پس از عقد NDA درخواست می‌شوند.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۲۱. زمان مورد انتظار برای آمادگی پذیرش یا عرضه چیست؟</label>
                      <select
                        value={expectedListingTimeline}
                        onChange={e => setExpectedListingTimeline(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none"
                      >
                        <option value="هم‌اکنون آماده بررسی هستیم">هم‌اکنون آماده بررسی هستیم</option>
                        <option value="تا یک ماه آینده">تا یک ماه آینده</option>
                        <option value="یک تا سه ماه آینده">یک تا سه ماه آینده</option>
                        <option value="سه تا شش ماه آینده">سه تا شش ماه آینده</option>
                        <option value="بیش از شش ماه">بیش از شش ماه</option>
                        <option value="هنوز مشخص نیست">هنوز مشخص نیست</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-300">۲۲. توضیحات تکمیلی یا درخواست مشخص از پلتفرم و صرافی‌ها</label>
                      <textarea
                        rows={2}
                        value={additionalNotes}
                        onChange={e => setAdditionalNotes(e.target.value)}
                        placeholder="نیازمندی‌ها به بازارگردانی، جفت‌ارزهای مدنظر (USDT/IRT)، زمان‌بندی کمپین لانچ یا سایر موارد..."
                        className="w-full px-3.5 py-2.5 rounded-xl border bg-neutral-900 border-neutral-800 text-white focus:border-[#F7931A] outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & CONFIRM */}
              {step === 5 && (
                <div className="space-y-5 animate-in fade-in text-xs">
                  <div className="border-b border-neutral-800 pb-3">
                    <h4 className="text-base font-bold text-white mb-1">بخش چهارم: بازبینی نهایی و تأیید شرایط</h4>
                    <p className="text-neutral-400">لطفاً پیش از ثبت نهایی، خلاصه پرونده و بیانیه شرایط پیش‌درخواست را با دقت مطالعه فرمایید.</p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="font-bold text-white">پروژه متقاضی:</span>
                      <span className="font-mono text-[#F7931A] font-bold text-sm">{tokenName || 'توکن پیشنهادی'} ({tokenSymbol || 'TKN'})</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                      <div>
                        <span className="text-neutral-500 block">شخص حقوقی:</span>
                        <span className="text-white font-medium">{entityName || 'ثبت نشده'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">نماینده پیگیری:</span>
                        <span className="text-white font-medium">{representativeName || 'ثبت نشده'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">شماره تماس:</span>
                        <span className="text-white font-mono">{representativePhone || 'ثبت نشده'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">شبکه بلاکچین:</span>
                        <span className="text-white font-mono uppercase">{blockchainNetwork}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">دسته‌بندی دارایی:</span>
                        <span className="text-white">{underlyingAssetCategory}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">افق زمانی:</span>
                        <span className="text-white">{expectedListingTimeline}</span>
                      </div>
                    </div>

                    <div className="border-t border-neutral-800 pt-3">
                      <span className="text-neutral-400 block mb-2 font-semibold">صرافی‌ها و بازارهای هدف انتخابی ({selectedMarkets.length} بازار):</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMarkets.map(mId => {
                          const mObj = AVAILABLE_MARKETS.find(m => m.id === mId);
                          return (
                            <span key={mId} className="px-2.5 py-1 rounded-lg bg-[#F7931A]/10 text-[#F7931A] border border-[#F7931A]/30 font-bold text-[11px] flex items-center gap-1">
                              <span>{mObj?.nameFa || mId}</span>
                              <span className="text-[9px] font-mono opacity-70">({mObj?.name})</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Legal Terms Statement (Directly from Q23 of Google Form) */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-neutral-300 space-y-3 leading-relaxed">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>تأیید صحت اطلاعات و شرایط پیش‌درخواست پذیرش (ماده ۲۳)</span>
                    </div>
                    <p className="text-[11px] text-justify text-neutral-300">
                      «تأیید می‌کنم اطلاعات ارائه‌شده تا حد اطلاع من صحیح است و اختیار معرفی یا پیگیری این پروژه را دارم. آگاه هستم که ثبت درخواست به معنای موافقت قطعی با پذیرش یا معامله توکن در صرافی‌های هدف نیست و بررسی‌های حقوقی، مالی، فنی، بازارگردانی و انطباقی مستقلی برای تصمیم نهایی لازم خواهد بود. با ارتباط و تماس کارگروه پذیرش WeSee و صرافی‌های منتخب برای پیگیری درخواست موافقم.»
                    </p>

                    <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none text-white font-bold">
                      <input
                        type="checkbox"
                        required
                        checked={termsConfirmed}
                        onChange={e => setTermsConfirmed(e.target.checked)}
                        className="w-4 h-4 rounded text-[#F7931A] focus:ring-0 focus:outline-none accent-[#F7931A]"
                      />
                      <span>متن فوق را مطالعه نموده و شرایط پیش‌درخواست را تأیید می‌نمایم.</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="border-t border-neutral-800 pt-4 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-5 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>مرحله قبلی</span>
                  </button>
                ) : <div />}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#F7931A]/20"
                  >
                    <span>مرحله بعدی</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!termsConfirmed}
                    className={`px-8 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl transition-all cursor-pointer ${
                      termsConfirmed
                        ? 'bg-[#F7931A] hover:bg-[#E07E05] text-black shadow-[#F7931A]/20 hover:scale-[1.02]'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>ثبت نهایی و آغاز سیکل بررسی پذیرش</span>
                  </button>
                )}
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

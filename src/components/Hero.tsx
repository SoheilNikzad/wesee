import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  TrendingUp, 
  Globe2, 
  Coins, 
  Layers
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../translations';

interface HeroProps {
  lang: Language;
  onOpenWizard: () => void;
  onExplore: () => void;
  onOpenListingWizard: () => void;
  canTokenize: boolean;
  isDarkMode: boolean;
}

export const Hero: React.FC<HeroProps> = ({ 
  lang, 
  onOpenWizard, 
  onExplore,
  onOpenListingWizard,
  canTokenize,
  isDarkMode
}) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'fa' || lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className={`relative overflow-hidden pt-12 pb-20 border-b transition-colors duration-200 font-vazir ${
      isDarkMode ? 'border-neutral-800 bg-[#0A0A0A]' : 'border-neutral-200 bg-white'
    }`}>
      {/* Background Glow */}
      <div className={`absolute top-0 left-1/2 -tranneutral-x-1/2 w-2/3 h-96 blur-3xl -z-10 pointer-events-none ${
        isDarkMode 
          ? 'bg-gradient-to-b from-[#F7931A]/10 via-transparent to-transparent' 
          : 'bg-gradient-to-b from-[#F7931A]/10 via-transparent to-transparent'
      }`} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-6 shadow-xs ${
            isDarkMode 
              ? 'bg-neutral-900/90 border-[#F7931A]/40 text-[#F7931A]' 
              : 'bg-[#FFF4E5] border-[#F7931A]/50 text-[#C46A00]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-[#F7931A] animate-pulse" />
            <span className="font-vazir">{t.heroBadge}</span>
          </div>

          {/* Heading - Vazirmatn for Persian, Outfit for English */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight mb-6 ${
            isRtl ? 'font-vazir' : 'font-outfit'
          } ${
            isDarkMode ? 'text-white' : 'text-neutral-950'
          }`}>
            {t.heroTitle1}{' '}
            <span className="text-[#F7931A] font-comfortaa">
              {t.heroTitle2}
            </span>
          </h1>

          {/* Description */}
          <p className={`text-base sm:text-lg leading-relaxed mb-8 font-vazir ${
            isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
          }`}>
            {t.heroDesc}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {canTokenize && (
              <button
                onClick={onOpenWizard}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-black text-xs sm:text-sm shadow-xl shadow-[#F7931A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-vazir cursor-pointer"
              >
                <span>{t.tokenizeNewAsset}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenListingWizard}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all font-vazir cursor-pointer ${
                isDarkMode 
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-700 shadow-xs'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>درخواست پذیرش در صرافی‌ها</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 font-bold">
                CEX • DEX
              </span>
            </button>

            <button
              onClick={onExplore}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all font-vazir cursor-pointer ${
                isDarkMode 
                  ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-white hover:border-[#F7931A]/50' 
                  : 'bg-white hover:bg-neutral-50 border-neutral-300 text-neutral-800 hover:border-neutral-400 shadow-xs'
              }`}
            >
              <Coins className="w-4 h-4 text-[#F7931A]" />
              <span>{t.exploreAssets}</span>
            </button>
          </div>

          {/* Listing Callout Banner */}
          <div 
            onClick={onOpenListingWizard}
            className={`mt-6 p-3 sm:p-3.5 rounded-2xl border max-w-xl mx-auto flex items-center justify-between gap-3 cursor-pointer transition-all ${
              isDarkMode 
                ? 'bg-neutral-900/80 border-neutral-800 hover:border-[#F7931A]/40' 
                : 'bg-neutral-50 border-neutral-200 hover:border-[#F7931A]/50 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5 text-right">
              <div className="w-8 h-8 rounded-xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                  توکن خود را قبلاً ساخته‌اید و خواهان نقدینگی هستید؟
                </p>
                <p className="text-[11px] text-neutral-400">
                  ارسال همزمان مدارک و پیش‌درخواست به آبان‌تتر، نوبیتکس، کوینکس و استخرهای Uniswap
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#F7931A] shrink-0 font-vazir flex items-center gap-1">
              <span>آغاز فرآیند</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Trust Highlights */}
          <div className={`mt-12 pt-8 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-right ${
            isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
          }`}>
            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
              isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-xs font-bold font-vazir ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>انطباق حقوقی و ممیزی</p>
                <p className="text-[10px] text-neutral-400 font-vazir">سند رسمی و کارشناسی</p>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
              isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-xs font-bold font-vazir ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>تقسیم سود خودکار</p>
                <p className="text-[10px] text-neutral-400 font-vazir">واریز اجاره و عایدی به ولت</p>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
              isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-xs font-bold font-vazir ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>سهام خرد دیجیتال</p>
                <p className="text-[10px] text-neutral-400 font-vazir">ورود سرمایه از ۲۰ دلار</p>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
              isDarkMode ? 'bg-[#121212] border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-xs font-bold font-vazir ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Polygon & BSC</p>
                <p className="text-[10px] text-neutral-400 font-vazir">کارمزد صدم سنت</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

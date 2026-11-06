import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Download, 
  ExternalLink, 
  Coins, 
  Wallet,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { RWAAsset } from '../types';
import { Language, TRANSLATIONS } from '../translations';
import { saveInvestmentToFirestore } from '../services/firebase';
import { downloadDeedDocument } from '../utils/fileDownloader';

interface AssetDetailModalProps {
  asset: RWAAsset | null;
  onClose: () => void;
  lang: Language;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose, lang }) => {
  if (!asset) return null;

  const t = TRANSLATIONS[lang];
  const [investmentTokens, setInvestmentTokens] = useState<number>(1);
  const [isBuying, setIsBuying] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  const totalCostUSD = investmentTokens * asset.tokenPriceUSD;
  const annualEstimatedYieldUSD = (totalCostUSD * asset.expectedAPY) / 100;

  const handleBuy = () => {
    setIsBuying(true);
    setTimeout(() => {
      setIsBuying(false);
      setPurchaseSuccess(true);
      saveInvestmentToFirestore(asset.title, asset.tokenSymbol, 'reza.kamali.investor@gmail.com', investmentTokens, totalCostUSD);
      setTimeout(() => {
        setPurchaseSuccess(false);
      }, 4000);
    }, 1500);
  };

  const copyContract = () => {
    if (asset.contractAddress) {
      navigator.clipboard.writeText(asset.contractAddress);
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 font-vazir">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-neutral-800 shadow-2xl p-6 sm:p-8 bg-[#121212] text-neutral-100 scrollbar-thin">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-[#F7931A]/10 text-[#F7931A] text-xs font-semibold">
            {asset.categoryLabel}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono uppercase">
            {asset.network}
          </span>
          {asset.complianceStatus === 'approved' && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مجوز رسمی: {asset.complianceLicenseId || 'REG-IR-2024'}</span>
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 font-outfit">
          {asset.title}
        </h2>

        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-vazir">
          <MapPin className="w-4 h-4 text-[#F7931A] shrink-0" />
          <span>{asset.location}</span>
          <span>•</span>
          <span>{t.tokenSymbol}: <strong className="font-mono text-[#F7931A]">{asset.tokenSymbol}</strong></span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl overflow-hidden h-64 bg-slate-900 border border-slate-800">
              <img
                src={asset.imageUrl}
                alt={asset.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2 font-outfit">توضیحات و گزارش کارشناسی دارایی</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-800 font-vazir">
                {asset.description}
              </p>
            </div>

            {/* Smart Contract Box */}
            {asset.contractAddress && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">آدرس قرارداد هوشمند توکن روی شبکه {asset.network.toUpperCase()}:</p>
                  <p className="font-mono text-xs text-[#F7931A] truncate max-w-xs sm:max-w-sm mt-0.5">{asset.contractAddress}</p>
                </div>
                <button
                  onClick={copyContract}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="کپی آدرس قرارداد"
                >
                  {copiedAddr ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Legal Documents */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 font-outfit">
                <FileText className="w-4 h-4 text-[#F7931A]" />
                <span>اسناد حقوقی و ممیزی‌های رسمی</span>
              </h4>
              <div className="space-y-2">
                {asset.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-[10px]">
                        {doc.type}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">{doc.title}</p>
                        <p className="text-[10px] text-slate-500">{doc.size}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => downloadDeedDocument(asset.title, doc.title, doc.type)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] transition-colors cursor-pointer"
                      title="دانلود مستقیم سند رسمی استعلام‌شده"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود سند</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Calculator */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/70 p-5 rounded-3xl border border-slate-800 space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs text-slate-400">{t.tokenPrice}:</span>
                <span className="text-xl font-black text-[#F7931A] font-mono">${asset.tokenPriceUSD}</span>
              </div>

              {/* Calculator Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex justify-between font-outfit">
                  <span>تعداد سهم (توکن) جهت خرید:</span>
                  <span className="font-mono text-[#F7931A]">{investmentTokens} عدد</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={investmentTokens}
                    onChange={(e) => setInvestmentTokens(Number(e.target.value))}
                    className="w-full accent-[#F7931A] cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>۱ توکن (${asset.tokenPriceUSD})</span>
                  <span>۱۰۰ توکن (${asset.tokenPriceUSD * 100})</span>
                </div>
              </div>

              {/* Projected Returns */}
              <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">مجموع سرمایه‌گذاری:</span>
                  <span className="font-bold text-white font-mono text-sm">${totalCostUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">نرخ سود سالانه (APY):</span>
                  <span className="font-bold text-emerald-400 font-mono">+{asset.expectedAPY}٪</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-300 font-semibold">سود تخمینی ۱۲ ماه آینده:</span>
                  <span className="font-bold text-[#F7931A] font-mono text-sm">+${annualEstimatedYieldUSD.toFixed(1)}</span>
                </div>
              </div>

              {/* Buy Action */}
              {purchaseSuccess ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-bold">خرید با موفقیت در بلاکچین ثبت شد!</p>
                    <p className="text-[11px] text-emerald-400">توکن‌های {asset.tokenSymbol} به کیف پول شما واریز گردید.</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleBuy}
                  disabled={isBuying}
                  className="w-full py-3.5 rounded-2xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-extrabold text-xs shadow-xl shadow-[#F7931A]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-outfit"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{isBuying ? 'در حال ارسال تراکنش به شبکه...' : `خرید ${investmentTokens} توکن با پرداخت $${totalCostUSD}`}</span>
                </button>
              )}

              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                مالکیت سهم دیجیتال با کد شناسه یکتا در شبکه {asset.network.toUpperCase()} صادر شده و قابلیت دریافت سود تقسیمی ماهانه را فراهم می‌سازد.
              </p>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

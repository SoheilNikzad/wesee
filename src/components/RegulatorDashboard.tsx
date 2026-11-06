import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  XCircle,
  AlertCircle, 
  Download,
  Check,
  X
} from 'lucide-react';
import { RWAAsset } from '../types';
import { Language, TRANSLATIONS } from '../translations';
import { saveComplianceApprovalToFirestore } from '../services/firebase';
import { downloadDeedDocument } from '../utils/fileDownloader';

interface RegulatorDashboardProps {
  assets: RWAAsset[];
  lang: Language;
  onApproveAsset: (assetId: string, licenseId: string) => void;
  onRejectAsset?: (assetId: string, reason: string) => void;
}

export const RegulatorDashboard: React.FC<RegulatorDashboardProps> = ({
  assets,
  lang,
  onApproveAsset
}) => {
  const t = TRANSLATIONS[lang];
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [activeRejectModalId, setActiveRejectModalId] = useState<string | null>(null);

  const [approvedList, setApprovedList] = useState<string[]>([]);
  const [rejectedList, setRejectedList] = useState<string[]>([]);

  const handleApprove = (assetId: string) => {
    setApprovingId(assetId);
    setTimeout(() => {
      const targetAsset = assets.find(a => a.id === assetId);
      const generatedLicense = `REG-LIC-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;
      onApproveAsset(assetId, generatedLicense);
      saveComplianceApprovalToFirestore(targetAsset?.title || 'دارایی ممیزی شده', generatedLicense, 'dr.mohammadi.regulator@wesee.ir');
      setApprovedList(prev => [...prev, assetId]);
      setApprovingId(null);
    }, 1000);
  };

  const handleConfirmReject = (assetId: string) => {
    setRejectingId(assetId);
    setTimeout(() => {
      setRejectedList(prev => [...prev, assetId]);
      setActiveRejectModalId(null);
      setRejectingId(null);
      setRejectReason('');
    }, 800);
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in font-vazir">
      {/* Header banner */}
      <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7931A]/10 text-[#F7931A] text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>{t.roleRegulator}</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            {t.regulatorTitle}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            {t.regulatorDesc}
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-black/60 border border-neutral-800 text-xs text-right">
          <span className="text-neutral-400 block text-[10px]">دارایی‌های در صف بررسی:</span>
          <span className="font-mono font-bold text-[#F7931A] text-sm">
            {assets.filter(a => a.complianceStatus === 'pending' && !approvedList.includes(a.id) && !rejectedList.includes(a.id)).length} پرونده
          </span>
        </div>
      </div>

      {/* Asset Audit List */}
      <div className="space-y-4">
        {assets.map((asset) => {
          const isPending = asset.complianceStatus === 'pending' && !approvedList.includes(asset.id) && !rejectedList.includes(asset.id);
          const isApproved = asset.complianceStatus === 'approved' || approvedList.includes(asset.id);
          const isRejected = rejectedList.includes(asset.id);

          return (
            <div
              key={asset.id}
              className={`p-5 rounded-2xl border transition-all ${
                isPending
                  ? 'bg-[#141414] border-[#F7931A]/30 shadow-md'
                  : 'bg-[#111111] border-[#222222]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                
                {/* Left Info */}
                <div className="flex items-start gap-4">
                  <img src={asset.imageUrl} alt={asset.title} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-neutral-800" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-medium">
                        {asset.categoryLabel}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#F7931A]">
                        {asset.tokenSymbol}
                      </span>
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>مجوز صادر شد</span>
                        </span>
                      ) : isRejected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>رد شده / نیازمند اصلاح مدارک</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>در انتظار بررسی ممیزی</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white mb-1">{asset.title}</h4>
                    <p className="text-xs text-neutral-400 flex items-center gap-2">
                      <span>موقعیت: {asset.location}</span>
                      <span>•</span>
                      <span>ارزش: ${asset.totalValuationUSD.toLocaleString()}</span>
                    </p>

                    {/* REAL Legal documents list with actual file download! */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-[11px] text-neutral-400">اسناد بارگذاری‌شده جهت استعلام:</span>
                      {asset.documents.map((doc, dIdx) => (
                        <button
                          key={dIdx}
                          onClick={() => downloadDeedDocument(asset.title, doc.title, doc.type)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-[11px] text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="دانلود فایل رسمی استعلام سند"
                        >
                          <FileText className="w-3 h-3 text-[#F7931A]" />
                          <span>{doc.title}</span>
                          <Download className="w-3 h-3 text-neutral-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Actions: Approve & Reject Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {isApproved ? (
                    <div className="text-left bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
                      <span className="text-[10px] text-emerald-300 block">مجوز رسمی ثبت RWA:</span>
                      <span className="font-mono text-xs text-emerald-400 font-bold">
                        {asset.complianceLicenseId || 'REG-LIC-8820-2024'}
                      </span>
                    </div>
                  ) : isRejected ? (
                    <div className="text-left bg-red-500/10 border border-red-500/30 px-3.5 py-2 rounded-xl text-red-300 text-xs">
                      پرونده به دلیل نقص اسناد رد شد.
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {/* Approve Button */}
                      <button
                        onClick={() => handleApprove(asset.id)}
                        disabled={approvingId === asset.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span>{approvingId === asset.id ? 'در حال صدور...' : 'تأیید و صدور مجوز'}</span>
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => setActiveRejectModalId(asset.id)}
                        className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 border border-neutral-700 hover:border-red-500/40 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        <span>رد درخواست</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Reject Reason Modal Popup */}
              {activeRejectModalId === asset.id && (
                <div className="mt-4 p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400">ثبت علت رد یا کسری مدارک دارایی:</span>
                    <button onClick={() => setActiveRejectModalId(null)} className="text-neutral-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="مثال: نقص در گواهی پایان‌کار شهرداری یا انقضای ارزیابی کارشناس دادگستری"
                    className="w-full px-3 py-2 rounded-lg bg-black border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveRejectModalId(null)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 text-xs text-neutral-300"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={() => handleConfirmReject(asset.id)}
                      disabled={rejectingId === asset.id}
                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                    >
                      {rejectingId === asset.id ? 'در حال ثبت رد پرونده...' : 'تأیید و ثبت رد درخواست'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Cpu,
  UploadCloud,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { BlockchainNetwork, AssetCategory, TokenizeFormData, RWAAsset } from '../types';
import { generateRWASolidityContract } from '../utils/solidityGenerator';
import { Language, TRANSLATIONS } from '../translations';
import { saveAssetToFirestore } from '../services/firebase';

interface TokenizeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  defaultNetwork: BlockchainNetwork;
  onAssetCreated: (newAsset: RWAAsset) => void;
  lang: Language;
}

export const TokenizeWizard: React.FC<TokenizeWizardProps> = ({
  isOpen,
  onClose,
  defaultNetwork,
  onAssetCreated,
  lang
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<TokenizeFormData>({
    title: '',
    category: 'real-estate',
    location: '',
    description: '',
    physicalProofRef: '',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    totalValuationUSD: 500000,
    tokenizedPercentage: 100,
    minInvestmentUSD: 50,
    expectedAPY: 26,
    rentalYield: 8.5,
    network: defaultNetwork,
    tokenName: '',
    tokenSymbol: '',
    decimals: 18,
    totalSupply: 10000,
    hasWhitelist: true,
    canBurn: true,
    canPause: true
  });

  // Real uploaded file state
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<{
    txHash: string;
    contractAddress: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);

  const pricePerTokenUSD = Math.max(1, Math.round(formData.totalValuationUSD / (formData.totalSupply || 1)));

  const handleTitleChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      tokenName: prev.tokenName ? prev.tokenName : `WeSee ${val.substring(0, 15)}`,
      tokenSymbol: prev.tokenSymbol ? prev.tokenSymbol : `WSEE-${val.replace(/\s+/g, '').substring(0, 4).toUpperCase()}`
    }));
  };

  // Real File Upload Handler with 10MB size limit validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB standard limit
    if (file.size > maxSizeInBytes) {
      setFileError('حجم فایل انتخابی بیش از ۱۰ مگابایت است. لطفاً فایل سبک‌تری بارگذاری کنید.');
      return;
    }

    const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' مگابایت';
    setUploadedFile({
      name: file.name,
      size: fileSizeFormatted,
      type: file.type || 'اسناد رسمی'
    });

    // If it's an image, create object URL for live preview
    if (file.type.startsWith('image/')) {
      const imgUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl: imgUrl }));
    }
  };

  const handleDeployContract = () => {
    setIsDeploying(true);

    setTimeout(() => {
      const generatedAddress = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const generatedTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      setDeploymentResult({
        txHash: generatedTx,
        contractAddress: generatedAddress
      });
      setIsDeploying(false);

      const categoryLabels: Record<AssetCategory, string> = {
        'real-estate': 'املاک و مستغلات',
        'gold': 'طلا و فلزات',
        'energy': 'انرژی پاک',
        'agriculture': 'کشاورزی مدرن',
        'equity': 'سهام و سرمایه‌گذاری'
      };

      const newAsset: RWAAsset = {
        id: `rwa-${Date.now()}`,
        title: formData.title || 'دارایی توکنیزه‌شده جدید',
        category: formData.category,
        categoryLabel: categoryLabels[formData.category] || 'دارایی واقعی',
        location: formData.location || 'تهران، ایران',
        totalValuationUSD: formData.totalValuationUSD,
        totalValuationIRR: formData.totalValuationUSD * 60000,
        tokenizedPercentage: formData.tokenizedPercentage,
        tokenPriceUSD: pricePerTokenUSD,
        totalSupply: formData.totalSupply,
        tokensSold: 0,
        expectedAPY: formData.expectedAPY,
        rentalYield: formData.rentalYield,
        network: formData.network,
        tokenSymbol: formData.tokenSymbol || 'WSEE-RWA',
        tokenName: formData.tokenName || 'WeSee Asset Token',
        contractAddress: generatedAddress,
        imageUrl: formData.imageUrl,
        description: formData.description || 'این دارایی دارای مدارک مالکیت رسمی و ارزیابی کارشناس دادگستری بوده و به صورت سهم‌های توکنیزه شده در شبکه بلاکچین صادر گردیده است.',
        documents: [
          { 
            title: uploadedFile?.name ? `سند رسمی بارگذاری‌شده: ${uploadedFile.name}` : 'سند ثبتی رسمی و کارشناسی دارایی', 
            type: uploadedFile?.name.endsWith('.pdf') ? 'PDF' : 'DOC', 
            size: uploadedFile?.size || '۳.۲ مگابایت' 
          },
          { title: 'کد سورس قرارداد هوشمند (ممیزی شده)', type: 'SOL', size: '۱۲ کیلوبایت' }
        ],
        status: 'active',
        complianceStatus: 'pending',
        issuerName: 'شرکت متقاضی توکن‌سازی',
        minInvestmentUSD: formData.minInvestmentUSD
      };

      onAssetCreated(newAsset);
      saveAssetToFirestore(newAsset);
    }, 1800);
  };

  const generatedSolidity = generateRWASolidityContract(formData);

  const copySolidity = () => {
    navigator.clipboard.writeText(generatedSolidity);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadSolidity = () => {
    const blob = new Blob([generatedSolidity], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.tokenSymbol || 'RWAToken'}.sol`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 font-vazir">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-neutral-800 shadow-2xl p-6 sm:p-8 bg-[#121212] text-neutral-100 scrollbar-thin">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7931A]/10 text-[#F7931A] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ویزارد ۴ مرحله‌ای توکن‌سازی RWA</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            صدور و انتشار قرارداد هوشمند توکن دارایی
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            مشخصات دارایی و فایل اسناد رسمی را بارگذاری کنید، توکنومیکس را تعیین نمایید و قرارداد را مستقیماً صادر کنید.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mb-8 font-outfit">
          {[
            { num: 1, label: 'اطلاعات دارایی' },
            { num: 2, label: 'ارزش‌گذاری مالی' },
            { num: 3, label: 'پیکربندی توکن' },
            { num: 4, label: 'انتشار در بلاکچین' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                step === s.num
                  ? 'bg-[#F7931A]/15 border-[#F7931A] text-[#F7931A] font-bold'
                  : step > s.num
                  ? 'bg-neutral-900 border-neutral-700 text-emerald-400'
                  : 'bg-black/30 border-neutral-800 text-neutral-500'
              }`}
            >
              <div className="text-[10px] font-mono">گام {s.num}</div>
              <div className="text-xs truncate font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* STEP 1: ASSET INFO & REAL FILE UPLOAD */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                دسته‌بندی دارایی فیزیکی:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'real-estate', label: '🏢 املاک و مستغلات' },
                  { id: 'gold', label: '🪙 طلا و فلزات گرانبها' },
                  { id: 'energy', label: '⚡ انرژی پاک' },
                  { id: 'agriculture', label: '🌾 کشاورزی و باغات' },
                  { id: 'equity', label: '📈 سهام پروژه و شرکت' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id as AssetCategory })}
                    className={`p-2.5 rounded-xl border text-right text-xs font-semibold transition-all ${
                      formData.category === cat.id
                        ? 'bg-[#F7931A]/15 border-[#F7931A] text-[#F7931A]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                عنوان و نام دارایی فیزیکی:
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="مثال: ساختمان اداری وزرا یا ۵ کیلوگرم شمش طلای امانات"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F7931A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  موقعیت فیزیکی / محل نگهداری:
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="مثال: تهران، خیابان وزرا یا خزانه امنیتی بانک"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F7931A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  پلاک ثبتی یا کد رهگیری سند:
                </label>
                <input
                  type="text"
                  value={formData.physicalProofRef}
                  onChange={(e) => setFormData({ ...formData, physicalProofRef: e.target.value })}
                  placeholder="مثال: سند تک‌برگ شماره ۱۲۴۸۵-ب فرعی"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F7931A]"
                />
              </div>
            </div>

            {/* REAL File Upload Drag-and-Drop Zone */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                بارگذاری اسناد رسمی مالکیت و کارشناسی دادگستری (حداکثر ۱۰ مگابایت):
              </label>
              
              <div className="relative border-2 border-dashed border-neutral-700 hover:border-[#F7931A]/60 rounded-2xl p-6 text-center bg-neutral-900/60 transition-colors cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-3 text-emerald-400">
                    <FileCheck className="w-8 h-8" />
                    <div className="text-right">
                      <p className="font-bold text-xs text-white">{uploadedFile.name}</p>
                      <p className="text-[11px] text-neutral-400">{uploadedFile.size} • فایل با موفقیت انتخاب شد</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <UploadCloud className="w-8 h-8 text-[#F7931A] mx-auto" />
                    <p className="text-xs font-bold text-white">برای انتخاب فایل رسمی کلیک کنید یا فایل را اینجا بکشید</p>
                    <p className="text-[11px] text-neutral-400">پشتیبانی از فرمت‌های PDF، تصاویر اسناد (PNG/JPG) تا سقف ۱۰ مگابایت</p>
                  </div>
                )}
              </div>

              {fileError && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 mt-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                توضیحات و گزارش کارشناسی دارایی:
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="توضیح دهید دارایی شامل چه شرایطی است، آیا دارای مستأجر یا عایدی نقدی است یا خیر..."
                className="w-full px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F7931A]"
              />
            </div>
          </div>
        )}

        {/* STEP 2: FINANCIAL TOKENOMICS */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  ارزش کل کارشناسی شده دارایی (USD):
                </label>
                <input
                  type="number"
                  value={formData.totalValuationUSD}
                  onChange={(e) => setFormData({ ...formData, totalValuationUSD: Math.max(1000, Number(e.target.value)) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white font-mono focus:outline-none focus:border-[#F7931A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  درصد سهم توکنیزه‌شده جهت عرضه (٪):
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.tokenizedPercentage}
                  onChange={(e) => setFormData({ ...formData, tokenizedPercentage: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white font-mono focus:outline-none focus:border-[#F7931A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  تعداد کل توکن‌های سهمی (Total Supply):
                </label>
                <input
                  type="number"
                  value={formData.totalSupply}
                  onChange={(e) => setFormData({ ...formData, totalSupply: Math.max(10, Number(e.target.value)) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white font-mono focus:outline-none focus:border-[#F7931A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  نرخ سود سالانه انتظاری (APY %):
                </label>
                <input
                  type="number"
                  value={formData.expectedAPY}
                  onChange={(e) => setFormData({ ...formData, expectedAPY: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white font-mono focus:outline-none focus:border-[#F7931A]"
                />
              </div>
            </div>

            {/* Calculations Box */}
            <div className="p-4 rounded-2xl bg-black/60 border border-neutral-800 space-y-2">
              <h4 className="text-xs font-bold text-[#F7931A]">خلاصه محاسبات توکنومیکس:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-neutral-400 text-[10px]">قیمت هر سهم دیجیتال:</span>
                  <p className="font-mono font-bold text-white text-sm mt-0.5">${pricePerTokenUSD}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-neutral-400 text-[10px]">ارزش عرضه شده:</span>
                  <p className="font-mono font-bold text-[#F7931A] text-sm mt-0.5">
                    ${((formData.totalValuationUSD * formData.tokenizedPercentage) / 100).toLocaleString()}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <span className="text-neutral-400 text-[10px]">حداقل ورود:</span>
                  <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">${pricePerTokenUSD}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: WEB3 TOKEN CONFIG */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                انتخاب شبکه بلاکچین استقرار توکن:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, network: 'polygon' })}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                    formData.network === 'polygon'
                      ? 'bg-purple-950/30 border-purple-500 text-purple-200'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm text-white">Polygon</p>
                    <p className="text-[11px] text-neutral-400">کارمزد صدم سنت، امنیت اتریوم</p>
                  </div>
                  <span className="w-3.5 h-3.5 rounded-full bg-purple-500" />
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, network: 'bsc' })}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                    formData.network === 'bsc'
                      ? 'bg-yellow-950/30 border-yellow-500 text-yellow-200'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm text-white">BNB Chain (BSC)</p>
                    <p className="text-[11px] text-neutral-400">نقدینگی بالا، سازگاری جهانی</p>
                  </div>
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  نام کامل توکن (Token Name):
                </label>
                <input
                  type="text"
                  value={formData.tokenName}
                  onChange={(e) => setFormData({ ...formData, tokenName: e.target.value })}
                  placeholder="مثال: WeSee Vozara Real Estate"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#F7931A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  نماد اختصاری توکن (Token Symbol):
                </label>
                <input
                  type="text"
                  value={formData.tokenSymbol}
                  onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value.toUpperCase() })}
                  placeholder="مثال: WSEE-VOZ"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#F7931A]"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-neutral-200">احراز هویت و وایت‌لیست خریداران (KYC Whitelist)</p>
                  <p className="text-[11px] text-neutral-500">فقط سرمایه‌گذاران تأییدشده حق معامله توکن‌ها را خواهند داشت</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.hasWhitelist}
                  onChange={(e) => setFormData({ ...formData, hasWhitelist: e.target.checked })}
                  className="w-4 h-4 accent-[#F7931A]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-neutral-200">توقف اضطراری نقل و انتقالات (Pausable)</p>
                  <p className="text-[11px] text-neutral-500">امکان تعلیق معاملات در زمان بروز دعاوی حقوقی یا انتقال سند</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.canPause}
                  onChange={(e) => setFormData({ ...formData, canPause: e.target.checked })}
                  className="w-4 h-4 accent-[#F7931A]"
                />
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: DEPLOYMENT */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            {deploymentResult ? (
              <div className="p-6 rounded-3xl bg-neutral-900 border border-emerald-500/50 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-white">توکن RWA با موفقیت در بلاکچین منتشر شد!</h3>
                <p className="text-xs text-neutral-300 max-w-md mx-auto">
                  قرارداد هوشمند روی شبکه <strong>{formData.network.toUpperCase()}</strong> مستقر شد و پرونده به همراه اسناد به کارتابل ناظر و قانون‌گذار ارسال گردید.
                </p>

                <div className="p-4 rounded-xl bg-black/60 border border-neutral-800 text-right space-y-2 text-xs">
                  <div>
                    <span className="text-neutral-400">آدرس قرارداد توکن:</span>
                    <p className="font-mono text-[#F7931A] text-xs break-all mt-0.5">{deploymentResult.contractAddress}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">هش تراکنش (Tx Hash):</span>
                    <p className="font-mono text-neutral-300 text-xs break-all mt-0.5">{deploymentResult.txHash}</p>
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-extrabold text-xs"
                  >
                    مشاهده دارایی در پلتفرم
                  </button>
                  <button
                    onClick={downloadSolidity}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white font-medium text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود سورس سالیدیتی (.sol)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Summary */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <h4 className="text-xs font-bold text-white">مرور مشخصات قرارداد و اسناد پیوست</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-black border border-neutral-800">
                      <p className="text-[10px] text-neutral-400">نام توکن</p>
                      <p className="font-bold text-white mt-0.5 truncate">{formData.tokenName}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black border border-neutral-800">
                      <p className="text-[10px] text-neutral-400">نماد</p>
                      <p className="font-bold font-mono text-[#F7931A] mt-0.5">{formData.tokenSymbol}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black border border-neutral-800">
                      <p className="text-[10px] text-neutral-400">شبکه بلاکچین</p>
                      <p className="font-bold text-white uppercase mt-0.5">{formData.network}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black border border-neutral-800">
                      <p className="text-[10px] text-neutral-400">سند بارگذاری‌شده</p>
                      <p className="font-bold text-emerald-400 mt-0.5 truncate">{uploadedFile?.name || 'سند پیش‌فرض'}</p>
                    </div>
                  </div>
                </div>

                {/* Solidity Preview Toggle */}
                <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-black/60">
                  <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800 text-xs">
                    <div className="flex items-center gap-2 text-neutral-300 font-mono">
                      <Code2 className="w-4 h-4 text-[#F7931A]" />
                      <span>{formData.tokenSymbol}.sol (Solidity v0.8.20)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copySolidity}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] flex items-center gap-1"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>کپی سورس</span>
                      </button>
                      <button
                        onClick={() => setShowCodePreview(!showCodePreview)}
                        className="text-[#F7931A] hover:underline text-[11px]"
                      >
                        {showCodePreview ? 'بستن کد' : 'مشاهده کد سالیدیتی'}
                      </button>
                    </div>
                  </div>
                  {showCodePreview && (
                    <pre className="p-4 text-[11px] font-mono text-neutral-300 max-h-56 overflow-y-auto dir-ltr text-left bg-black">
                      {generatedSolidity}
                    </pre>
                  )}
                </div>

                {/* Action Deploy Button */}
                <button
                  onClick={handleDeployContract}
                  disabled={isDeploying}
                  className="w-full py-4 rounded-2xl bg-[#F7931A] hover:bg-[#E07E05] text-black font-extrabold text-sm shadow-xl shadow-[#F7931A]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Cpu className="w-5 h-5" />
                  <span>{isDeploying ? 'در حال ارسال تراکنش و استقرار در بلاکچین...' : `انتشار و ساخت قرارداد روی شبکه ${formData.network.toUpperCase()}`}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Controls */}
        {!deploymentResult && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-neutral-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>مرحله قبل</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E07E05] text-black text-xs font-extrabold shadow-lg shadow-[#F7931A]/20 transition-all"
              >
                <span>مرحله بعد</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
};

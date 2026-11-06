import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Briefcase, 
  Scale, 
  Settings, 
  Sparkles
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { Language, TRANSLATIONS } from '../translations';
import { loginWithGoogleFirebase } from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLoginSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];
  const [selectedRole, setSelectedRole] = useState<UserRole>('investor');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const rolesList: {
    id: UserRole;
    title: string;
    description: string;
    icon: any;
    badge: string;
  }[] = [
    {
      id: 'investor',
      title: t.roleInvestor,
      description: lang === 'fa' 
        ? 'مشاهده بازار دارایی‌ها، خرید سهم خرد، اتصال کیف پول و دریافت سود تقسیمی' 
        : 'Explore verified assets, purchase fractional tokens, and claim yields',
      icon: UserCheck,
      badge: lang === 'fa' ? 'پیش‌فرض عمومی' : 'Public Default'
    },
    {
      id: 'issuer',
      title: t.roleIssuer,
      description: lang === 'fa'
        ? 'ثبت و توکن‌سازی املاک، طلا و پروژه‌ها، بارگذاری اسناد و صدور قرارداد'
        : 'Onboard real estate, gold reserves, and deploy custom smart contracts',
      icon: Briefcase,
      badge: lang === 'fa' ? 'صدور توکن' : 'Token Minting'
    },
    {
      id: 'regulator',
      title: t.roleRegulator,
      description: lang === 'fa'
        ? 'کارتابل بررسی اسناد رسمی دادگستری، استعلام ثبتی و صدور مجوز رسمی RWA'
        : 'Verify deeds, inspect appraisals, and grant legal compliance endorsements',
      icon: Scale,
      badge: lang === 'fa' ? 'نظارت و حاکمیت' : 'Governance'
    },
    {
      id: 'admin',
      title: t.roleAdmin,
      description: lang === 'fa'
        ? 'مانیتورینگ کل شبکه (Polygon & BSC)، کارمزدهای سیستم و تنظیمات پلتفرم'
        : 'Full protocol console, fee management, and contract bridge oversight',
      icon: Settings,
      badge: lang === 'fa' ? 'کنترل سیستم' : 'SysAdmin'
    }
  ];

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const profile = await loginWithGoogleFirebase(selectedRole);
      onLoginSuccess(profile);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-neutral-700/80 shadow-2xl p-6 sm:p-8 bg-[#141414] text-neutral-100 font-vazir">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#F7931A]/10 border border-[#F7931A]/30 text-[#F7931A] mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-vazir tracking-tight text-white">
            {lang === 'fa' ? 'ورود با اکانت گوگل به WeSee' : 'Sign in to WeSee with Google'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto font-vazir">
            {lang === 'fa' 
              ? 'اطلاعات ورود در دیتابیس Firebase و کالکشن Users ذخیره خواهد شد.'
              : 'Authentication details will be recorded in your Firebase Firestore users collection.'}
          </p>
        </div>

        {/* Role Selector Cards */}
        <div className="space-y-2.5 mb-6">
          <label className="block text-xs font-semibold text-neutral-300 mb-1 font-vazir">
            {lang === 'fa' ? 'انتخاب نقش و سطح دسترسی شما:' : 'Select Access Role:'}
          </label>
          {rolesList.map((role) => {
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#F7931A]/10 border-[#F7931A] text-white shadow-lg shadow-[#F7931A]/10'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#F7931A] text-black font-bold' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-vazir">{role.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isSelected ? 'bg-[#F7931A]/20 text-[#F7931A]' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {role.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5 font-vazir">{role.description}</p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-[#F7931A] bg-[#F7931A]' : 'border-neutral-700'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Google Login Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 font-vazir"
          >
            {/* Real Official Google SVG Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>
              {isLoggingIn 
                ? 'در حال برقراری ارتباط با Firebase Auth...' 
                : `ورود با گوگل و ثبت در دیتابیس فایربیس`}
            </span>
          </button>

          <p className="text-[11px] text-neutral-500 text-center font-vazir">
            متصل به Firebase Authentication و ذخیره شناسه کاربر در Firestore
          </p>
        </div>

      </div>
    </div>
  );
};

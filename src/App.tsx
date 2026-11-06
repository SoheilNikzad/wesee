import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsSection } from './components/StatsSection';
import { AssetCatalog } from './components/AssetCatalog';
import { AssetDetailModal } from './components/AssetDetailModal';
import { TokenizeWizard } from './components/TokenizeWizard';
import { AuthModal } from './components/AuthModal';
import { FirebaseInspectorModal } from './components/FirebaseInspectorModal';
import { RegulatorDashboard } from './components/RegulatorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { INITIAL_RWA_ASSETS } from './mockData';
import { RWAAsset, BlockchainNetwork, UserRole, UserProfile } from './types';
import { Language, TRANSLATIONS } from './translations';
import { 
  FileCheck2, 
  Coins, 
  Scale, 
  Cpu 
} from 'lucide-react';

export function App() {
  const [lang, setLang] = useState<Language>('fa');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [network, setNetwork] = useState<BlockchainNetwork>('polygon');
  const [assets, setAssets] = useState<RWAAsset[]>(INITIAL_RWA_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<RWAAsset | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'regulator' | 'admin'>('catalog');

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'کاربر مهمان',
    email: '',
    avatarUrl: '',
    role: 'investor',
    isLoggedIn: false,
    loginMethod: 'guest'
  });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const isRtl = lang === 'fa' || lang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      document.body.style.backgroundColor = '#0B0E14';
      document.body.style.color = '#F9FAFB';
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      document.body.style.backgroundColor = '#F4F5F7';
      document.body.style.color = '#111827';
    }
  }, [isDarkMode]);

  const handleAssetCreated = (newAsset: RWAAsset) => {
    setAssets(prev => [newAsset, ...prev]);
  };

  const handleApproveAsset = (assetId: string, licenseId: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          complianceStatus: 'approved',
          complianceLicenseId: licenseId
        };
      }
      return a;
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setUserProfile(prev => ({ ...prev, role }));
    if (role === 'regulator') {
      setActiveTab('regulator');
    } else if (role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('catalog');
    }
  };

  const handleSignOut = () => {
    setUserProfile({
      name: 'کاربر مهمان',
      email: '',
      avatarUrl: '',
      role: 'investor',
      isLoggedIn: false,
      loginMethod: 'guest'
    });
    setActiveTab('catalog');
  };

  const scrollToCatalog = () => {
    setActiveTab('catalog');
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
      isDarkMode ? 'bg-[#0B0E14] text-slate-100' : 'bg-[#F4F5F7] text-slate-900'
    }`}>
      
      {/* Navbar with Day/Night, Multi-language, Google Login & Role switcher */}
      <Navbar
        currentNetwork={network}
        onNetworkChange={setNetwork}
        lang={lang}
        onLangChange={setLang}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        userProfile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        onOpenWizard={() => setIsWizardOpen(true)}
        onScrollToCatalog={scrollToCatalog}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
      />

      <main className="flex-1">
        {/* If Active Tab is Regulator Portal */}
        {activeTab === 'regulator' ? (
          <RegulatorDashboard
            assets={assets}
            lang={lang}
            onApproveAsset={handleApproveAsset}
          />
        ) : activeTab === 'admin' ? (
          <AdminDashboard
            lang={lang}
          />
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              lang={lang}
              onOpenWizard={() => setIsWizardOpen(true)}
              onExplore={scrollToCatalog}
              canTokenize={userProfile.role === 'issuer' || userProfile.role === 'admin'}
              isDarkMode={isDarkMode}
            />

            {/* Stats Section */}
            <StatsSection isDarkMode={isDarkMode} />

            {/* Catalog of Assets */}
            <AssetCatalog
              assets={assets}
              lang={lang}
              onSelectAsset={setSelectedAsset}
              onOpenWizard={() => setIsWizardOpen(true)}
              canTokenize={userProfile.role === 'issuer' || userProfile.role === 'admin'}
              isDarkMode={isDarkMode}
            />

            {/* How It Works Section */}
            <section id="how-it-works" className={`py-20 border-t transition-colors duration-200 ${
              isDarkMode ? 'border-white/10 bg-slate-900/20' : 'border-slate-200 bg-white'
            }`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <span className="text-xs font-semibold text-[#F7931A] uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#F7931A]/10 font-vazir">
                    فرآیند استاندارد ۴ مرحله‌ای
                  </span>
                  <h2 className={`text-3xl font-black mt-3 font-vazir ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {t.howItWorks}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-2 font-vazir ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    انطباق با استانداردهای حقوقی، بررسی اسناد ثبتی توسط ناظر و صدور قراردادهای هوشمند مستقل
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    {
                      step: '۰۱',
                      title: 'ثبت و بارگذاری اسناد',
                      desc: 'اسناد مالکیت رسمی، گزارش کارشناس دادگستری و مشخصات فیزیکی دارایی ثبت می‌شود.',
                      icon: FileCheck2
                    },
                    {
                      step: '۰۲',
                      title: 'ممیزی نماینده ناظر و قانون‌گذار',
                      desc: 'استعلام‌های ثبتی انجام و مجوز رسمی انطباق قانونی برای انتشار توکن صادر می‌گردد.',
                      icon: Scale
                    },
                    {
                      step: '۰۳',
                      title: 'استقرار قرارداد هوشمند',
                      desc: 'قرارداد استاندارد RWA روی Polygon یا BSC با وایت‌لیست خریداران صادر می‌شود.',
                      icon: Cpu
                    },
                    {
                      step: '۰۴',
                      title: 'جذب سرمایه و توزیع سود',
                      desc: 'سرمایه‌گذاران سهم خرد می‌خرند و سود حاصل از اجاره یا فروش به ولت آن‌ها واریز می‌شود.',
                      icon: Coins
                    }
                  ].map((item, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl border relative group transition-all ${
                      isDarkMode 
                        ? 'bg-[#121622] border-slate-800 hover:border-[#F7931A]/40' 
                        : 'bg-slate-50 border-slate-200 hover:border-[#F7931A]/60 shadow-xs'
                    }`}>
                      <span className="text-3xl font-black text-slate-800 font-mono absolute top-4 left-4 group-hover:text-[#F7931A]/20 transition-colors">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#F7931A]/10 text-[#F7931A] flex items-center justify-center mb-4">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <h3 className={`text-base font-bold mb-2 font-vazir ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>{item.title}</h3>
                      <p className={`text-xs leading-relaxed font-vazir ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Asset Detail Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        lang={lang}
      />

      {/* Tokenize Wizard Modal */}
      <TokenizeWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        defaultNetwork={network}
        onAssetCreated={handleAssetCreated}
        lang={lang}
      />

      {/* Google Login & Role Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
        onLoginSuccess={(profile) => {
          setUserProfile(profile);
          if (profile.role === 'regulator') setActiveTab('regulator');
          else if (profile.role === 'admin') setActiveTab('admin');
          else setActiveTab('catalog');
        }}
      />

      {/* Firebase Database Inspector Modal */}
      <FirebaseInspectorModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

      {/* Footer */}
      <Footer lang={lang} />

    </div>
  );
}

export default App;

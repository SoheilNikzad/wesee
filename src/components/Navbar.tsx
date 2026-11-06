import React, { useState } from 'react';
import { 
  ChevronDown, 
  PlusCircle, 
  Sun, 
  Moon, 
  Globe, 
  LogOut, 
  Scale, 
  Settings, 
  UserCheck, 
  Briefcase,
  Check,
  Wallet,
  Database,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { BlockchainNetwork, UserRole, UserProfile } from '../types';
import { Language, TRANSLATIONS } from '../translations';

interface NavbarProps {
  currentNetwork: BlockchainNetwork;
  onNetworkChange: (net: BlockchainNetwork) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  userProfile: UserProfile;
  onOpenAuthModal: () => void;
  onRoleChange: (role: UserRole) => void;
  onSignOut: () => void;
  onOpenWizard: () => void;
  onScrollToCatalog: () => void;
  activeTab: 'catalog' | 'regulator' | 'admin';
  setActiveTab: (tab: 'catalog' | 'regulator' | 'admin') => void;
  onOpenFirebaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentNetwork,
  onNetworkChange,
  lang,
  onLangChange,
  isDarkMode,
  onThemeToggle,
  userProfile,
  onOpenAuthModal,
  onRoleChange,
  onSignOut,
  onOpenWizard,
  onScrollToCatalog,
  activeTab,
  setActiveTab,
  onOpenFirebaseModal
}) => {
  const t = TRANSLATIONS[lang];
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNetMenuOpen, setIsNetMenuOpen] = useState(false);
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddr, setWalletAddr] = useState('');

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  ];

  const roles = [
    { id: 'investor' as UserRole, label: t.roleInvestor, icon: UserCheck },
    { id: 'issuer' as UserRole, label: t.roleIssuer, icon: Briefcase },
    { id: 'regulator' as UserRole, label: t.roleRegulator, icon: Scale },
    { id: 'admin' as UserRole, label: t.roleAdmin, icon: Settings },
  ];

  const connectWallet = async () => {
    const anyWin = window as any;
    if (anyWin.ethereum) {
      try {
        const accounts = await anyWin.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setWalletAddr(accounts[0]);
          setWalletConnected(true);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setWalletAddr('0x71C...4e9F');
      setWalletConnected(true);
    }
  };

  const currentRoleObj = roles.find(r => r.id === userProfile.role) || roles[0];
  const RoleIcon = currentRoleObj.icon;

  const isAdminOrRegulator = userProfile.role === 'admin' || userProfile.role === 'regulator';

  return (
    <header className={`sticky top-0 z-40 w-full h-16 transition-colors duration-200 border-b ${
      isDarkMode 
        ? 'bg-[#0D0D0D]/95 backdrop-blur-md border-[#262626]' 
        : 'bg-white/95 backdrop-blur-md border-[#E5E5E5] shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* RIGHT (RTL): Brand Logo & Emblem */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => { setActiveTab('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F7931A] text-black flex items-center justify-center font-bold shadow-md shadow-[#F7931A]/20">
              <span className="font-outfit font-black text-lg">W</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xl font-black font-comfortaa tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}>WeSee</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F7931A]/15 text-[#F7931A] border border-[#F7931A]/30 font-bold">
                  {t.domainBadge}
                </span>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold font-vazir">
            <button
              onClick={() => { setActiveTab('catalog'); onScrollToCatalog(); }}
              className={`transition-colors py-1 ${
                activeTab === 'catalog' 
                  ? 'text-[#F7931A] font-bold border-b-2 border-[#F7931A]' 
                  : isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              {t.exploreAssets}
            </button>

            {(userProfile.role === 'issuer' || userProfile.role === 'admin') && (
              <button
                onClick={onOpenWizard}
                className="transition-colors flex items-center gap-1.5 text-[#F7931A] hover:text-[#E07E05] font-bold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t.tokenizeNewAsset}</span>
              </button>
            )}

            {/* Unified Clean Management Dropdown (replaces 3 bulky buttons!) */}
            {isAdminOrRegulator && (
              <div className="relative">
                <button
                  onClick={() => setIsManageMenuOpen(!isManageMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    activeTab === 'regulator' || activeTab === 'admin'
                      ? 'bg-[#F7931A] text-black border-[#F7931A] font-bold'
                      : isDarkMode 
                        ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800' 
                        : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    {activeTab === 'regulator' ? 'کارتابل نظارت' : activeTab === 'admin' ? 'کنسول ادمین' : 'پنل مدیریت و داده'}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isManageMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 font-vazir ${
                    isDarkMode ? 'bg-[#141414] border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                  }`}>
                    <button
                      onClick={() => { setActiveTab('regulator'); setIsManageMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors text-right ${
                        activeTab === 'regulator' 
                          ? 'bg-[#F7931A]/20 text-[#F7931A] font-bold' 
                          : isDarkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
                      }`}
                    >
                      <Scale className="w-4 h-4 text-[#F7931A]" />
                      <div className="flex-1">
                        <p className="font-bold">کارتابل نظارت و مجوز</p>
                        <p className="text-[10px] text-neutral-400">تأیید یا رد اسناد ثبتی و دادگستری</p>
                      </div>
                    </button>

                    {userProfile.role === 'admin' && (
                      <button
                        onClick={() => { setActiveTab('admin'); setIsManageMenuOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors text-right ${
                          activeTab === 'admin' 
                            ? 'bg-[#F7931A]/20 text-[#F7931A] font-bold' 
                            : isDarkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
                        }`}
                      >
                        <Settings className="w-4 h-4 text-[#F7931A]" />
                        <div className="flex-1">
                          <p className="font-bold">کنسول مدیریت شبکه</p>
                          <p className="text-[10px] text-neutral-400">کارمزدها و مانیتورینگ نودها</p>
                        </div>
                      </button>
                    )}

                    <div className="border-t border-neutral-800/80 my-1"></div>

                    <button
                      onClick={() => { onOpenFirebaseModal(); setIsManageMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors text-right ${
                        isDarkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
                      }`}
                    >
                      <Database className="w-4 h-4 text-[#F7931A]" />
                      <div className="flex-1">
                        <p className="font-bold">مرکز داده فایربیس (Firestore)</p>
                        <p className="text-[10px] text-neutral-400">مشاهده جداول و اتصال کلیدها</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* LEFT (RTL): Standardized Compact Control Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Theme Toggle - Compact 36x36 */}
          <button
            onClick={onThemeToggle}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              isDarkMode 
                ? 'bg-neutral-900 border-neutral-800 text-[#F7931A] hover:bg-neutral-800' 
                : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
            }`}
            title={t.themeToggle}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language - Compact */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className={`h-9 px-2.5 rounded-xl border text-xs font-outfit flex items-center gap-1.5 transition-all ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800' 
                  : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#F7931A]" />
              <span className="uppercase font-bold text-[11px]">{lang}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isLangMenuOpen && (
              <div className={`absolute left-0 mt-2 w-32 rounded-xl border shadow-xl p-1 z-50 ${
                isDarkMode ? 'bg-[#141414] border-neutral-800' : 'bg-white border-neutral-200'
              }`}>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { onLangChange(l.code); setIsLangMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors font-vazir ${
                      lang === l.code 
                        ? 'bg-[#F7931A]/20 text-[#F7931A] font-bold' 
                        : isDarkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{l.label}</span>
                    {lang === l.code && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Network Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsNetMenuOpen(!isNetMenuOpen)}
              className={`h-9 px-3 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800' 
                  : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentNetwork === 'polygon' ? 'bg-purple-500' : 'bg-yellow-500'}`} />
              <span className="uppercase text-[11px] font-bold">{currentNetwork}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isNetMenuOpen && (
              <div className={`absolute left-0 mt-2 w-44 rounded-xl border shadow-xl p-1 z-50 font-vazir ${
                isDarkMode ? 'bg-[#141414] border-neutral-800' : 'bg-white border-neutral-200'
              }`}>
                <button
                  onClick={() => { onNetworkChange('polygon'); setIsNetMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg ${
                    currentNetwork === 'polygon' ? 'bg-purple-500/20 text-purple-400 font-bold' : isDarkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Polygon</span>
                </button>
                <button
                  onClick={() => { onNetworkChange('bsc'); setIsNetMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg ${
                    currentNetwork === 'bsc' ? 'bg-yellow-500/20 text-yellow-500 font-bold' : isDarkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>BNB Chain (BSC)</span>
                </button>
              </div>
            )}
          </div>

          {/* Database Inspector Direct Shortcut */}
          <button
            onClick={onOpenFirebaseModal}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              isDarkMode 
                ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-[#F7931A] hover:bg-neutral-800' 
                : 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-[#F7931A] hover:bg-neutral-200'
            }`}
            title="مرکز داده و کنسول فایربیس"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* User Profile & Role Switcher */}
          {userProfile.isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className={`h-9 px-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                  isDarkMode 
                    ? 'bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-800' 
                    : 'bg-neutral-100 border-neutral-300 text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-[#F7931A] text-black flex items-center justify-center font-bold">
                  <RoleIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-right hidden lg:block font-vazir">
                  <span className="text-xs font-bold block leading-none">{userProfile.name}</span>
                  <span className="text-[9px] text-[#F7931A] font-semibold">{currentRoleObj.label}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {isRoleMenuOpen && (
                <div className={`absolute left-0 mt-2 w-56 rounded-xl border shadow-xl p-1.5 z-50 font-vazir ${
                  isDarkMode ? 'bg-[#141414] border-neutral-800' : 'bg-white border-neutral-200'
                }`}>
                  <div className="px-2.5 py-1.5 border-b border-neutral-800/80 mb-1">
                    <span className="text-[10px] text-neutral-400 block font-mono">{userProfile.email}</span>
                  </div>
                  {roles.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        onClick={() => { onRoleChange(r.id); setIsRoleMenuOpen(false); }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg transition-all ${
                          userProfile.role === r.id 
                            ? 'bg-[#F7931A]/20 text-[#F7931A] font-bold' 
                            : isDarkMode ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="flex-1 text-right">{r.label}</span>
                        {userProfile.role === r.id && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                  <div className="border-t border-neutral-800/80 mt-1 pt-1">
                    <button
                      onClick={() => { onSignOut(); setIsRoleMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs shadow-xs flex items-center gap-2 transition-all font-vazir"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{t.googleLogin}</span>
            </button>
          )}

          {/* Web3 Wallet Connect */}
          {walletConnected ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#F7931A]/40 text-[#F7931A] font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F7931A] animate-pulse" />
              <span>{walletAddr.substring(0, 6)}...</span>
            </span>
          ) : (
            <button
              onClick={connectWallet}
              className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 font-vazir transition-all ${
                isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800' : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200'
              }`}
              title={t.connectWallet}
            >
              <Wallet className="w-3.5 h-3.5 text-[#F7931A]" />
              <span className="hidden sm:inline">{t.connectWallet}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

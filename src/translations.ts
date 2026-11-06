export type Language = 'fa' | 'en' | 'ar' | 'tr';

export interface Translations {
  appName: string;
  tagline: string;
  domainBadge: string;
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDesc: string;
  tokenizeNewAsset: string;
  exploreAssets: string;
  howItWorks: string;
  standards: string;
  catalogTitle: string;
  catalogSubtitle: string;
  searchPlaceholder: string;
  allAssets: string;
  realEstate: string;
  goldCommodities: string;
  cleanEnergy: string;
  agriculture: string;
  projectEquity: string;
  annualAPY: string;
  totalValuation: string;
  tokenPrice: string;
  funded: string;
  viewDetails: string;
  investNow: string;
  connectWallet: string;
  connected: string;
  googleLogin: string;
  signOut: string;
  roleInvestor: string;
  roleIssuer: string;
  roleRegulator: string;
  roleAdmin: string;
  switchRole: string;
  themeToggle: string;
  legalCompliance: string;
  auditBadge: string;
  networkName: string;
  tokenSymbol: string;
  regulatorTitle: string;
  regulatorDesc: string;
  approveCompliance: string;
  pendingCompliance: string;
  complianceApproved: string;
  adminTitle: string;
  adminDesc: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  fa: {
    appName: 'WeSee',
    tagline: 'پلتفرم توکن‌سازی دارایی‌های واقعی (RWA)',
    domainBadge: 'wesee.ir',
    heroBadge: 'انقلاب نقدشوندگی دارایی‌های واقعی با استاندارد بین‌المللی',
    heroTitle1: 'پلتفرم توکن‌سازی دارایی‌های واقعی',
    heroTitle2: '(RWA)',
    heroDesc: 'تبدیل املاک، طلا، انرژی تجدیدپذیر و پروژه‌های تولیدی به سهام خرد دیجیتال بر روی شبکه‌های بایننس و پالیگان با شفافیت و امنیت قراردادهای هوشمند.',
    tokenizeNewAsset: 'توکن‌سازی دارایی جدید',
    exploreAssets: 'کاوش دارایی‌ها',
    howItWorks: 'فرآیند کار',
    standards: 'استاندارد و امنیت',
    catalogTitle: 'بازار دارایی‌های توکنیزه‌شده',
    catalogSubtitle: 'فرصت‌های سرمایه‌گذاری با پشتوانه فیزیکی و بازدهی دوره‌ای معتبر',
    searchPlaceholder: 'جستجو بر اساس نام دارایی، شهر یا نماد...',
    allAssets: 'همه دارایی‌ها',
    realEstate: 'املاک و مستغلات',
    goldCommodities: 'طلا و فلزات',
    cleanEnergy: 'انرژی پاک',
    agriculture: 'کشاورزی مدرن',
    projectEquity: 'سهام پروژه‌ها',
    annualAPY: 'بازدهی سالانه',
    totalValuation: 'ارزش کل دارایی',
    tokenPrice: 'قیمت هر سهم دیجیتال',
    funded: 'تأمین مالی شده',
    viewDetails: 'مشاهده مدارک و خرید سهم',
    investNow: 'خرید سهم توکن',
    connectWallet: 'اتصال کیف پول',
    connected: 'متصل',
    googleLogin: 'ورود با گوگل',
    signOut: 'خروج',
    roleInvestor: 'سرمایه‌گذار / خریدار',
    roleIssuer: 'مالک دارایی / صادرکننده',
    roleRegulator: 'نماینده قانون‌گذار و ناظر',
    roleAdmin: 'مدیریت شبکه و پلتفرم',
    switchRole: 'تغییر نقش کاربری',
    themeToggle: 'تغییر تم روز / شب',
    legalCompliance: 'تأییدیه انطباق قانونی',
    auditBadge: 'دارای سند رسمی و کارشناسی دادگستری',
    networkName: 'شبکه بلاکچین',
    tokenSymbol: 'نماد توکن',
    regulatorTitle: 'کارتابل نظارت و استعلام مراجع قانونی',
    regulatorDesc: 'بررسی اسناد مالکیت، استعلام سامانه‌های ثبتی و صدور مجوز رسمی انتشار توکن RWA',
    approveCompliance: 'صدور مجوز انطباق قانونی',
    pendingCompliance: 'در انتظار ممیزی ناظر',
    complianceApproved: 'ممیزی شده و دارای مجوز رسمی',
    adminTitle: 'مرکز کنترل و نظارت ادمین شبکه',
    adminDesc: 'مدیریت پارامترهای پلتفرم، مانیتورینگ کانترکت‌ها و کنترل کارمزدها'
  },
  en: {
    appName: 'WeSee',
    tagline: 'Real World Asset (RWA) Tokenization Platform',
    domainBadge: 'wesee.ir',
    heroBadge: 'Unlocking Global Liquidity for Real-World Assets',
    heroTitle1: 'Enterprise Tokenization for Real-World Assets',
    heroTitle2: '(RWA)',
    heroDesc: 'Transform real estate, certified gold bullion, clean energy, and business equity into compliant fractional tokens on Polygon & BNB Chain.',
    tokenizeNewAsset: 'Tokenize New Asset',
    exploreAssets: 'Explore Assets',
    howItWorks: 'How It Works',
    standards: 'Compliance & Security',
    catalogTitle: 'RWA Marketplace',
    catalogSubtitle: 'Institutional-grade investment opportunities backed by verifiable physical assets.',
    searchPlaceholder: 'Search by title, location or symbol...',
    allAssets: 'All Assets',
    realEstate: 'Real Estate',
    goldCommodities: 'Gold & Metals',
    cleanEnergy: 'Clean Energy',
    agriculture: 'Agriculture',
    projectEquity: 'Business Equity',
    annualAPY: 'Expected APY',
    totalValuation: 'Total Valuation',
    tokenPrice: 'Token Share Price',
    funded: 'Funded',
    viewDetails: 'View Legal Deeds & Invest',
    investNow: 'Invest Now',
    connectWallet: 'Connect Wallet',
    connected: 'Connected',
    googleLogin: 'Sign in with Google',
    signOut: 'Sign Out',
    roleInvestor: 'Investor / Buyer',
    roleIssuer: 'Asset Issuer',
    roleRegulator: 'Regulator & Auditor',
    roleAdmin: 'Network Administrator',
    switchRole: 'Switch Role Profile',
    themeToggle: 'Toggle Theme',
    legalCompliance: 'Regulatory Compliance',
    auditBadge: 'Audited & Deed Verified',
    networkName: 'Blockchain Network',
    tokenSymbol: 'Token Symbol',
    regulatorTitle: 'Regulatory & Compliance Portal',
    regulatorDesc: 'Review legal deeds, official appraisals, and issue cryptographic compliance endorsements.',
    approveCompliance: 'Endorse Compliance & Grant License',
    pendingCompliance: 'Pending Regulatory Review',
    complianceApproved: 'Compliance Endorsed',
    adminTitle: 'Platform & Network Console',
    adminDesc: 'Monitor on-chain contracts, protocol parameters, and bridge operations.'
  },
  ar: {
    appName: 'WeSee',
    tagline: 'منصة ترميز الأصول الحقيقية (RWA)',
    domainBadge: 'wesee.ir',
    heroBadge: 'ثورة السيولة الرقمية للأصول الحقيقية المدعومة قانونياً',
    heroTitle1: 'منصة ترميز الأصول الحقيقية والاستثمار الجزئي',
    heroTitle2: '(RWA)',
    heroDesc: 'تحويل العقارات والذهب المعتمد ومزارع الطاقة النظيفة إلى حصص رقمية مجزأة على شبكات Polygon و BNB Chain بأعلى معايير الشفافية.',
    tokenizeNewAsset: 'ترميز أصل جديد',
    exploreAssets: 'استكشاف الأصول',
    howItWorks: 'كيف تعمل المنصة',
    standards: 'الامتثال والأمان',
    catalogTitle: 'سوق الأصول الحقيقية المرمزة',
    catalogSubtitle: 'فرص استثمارية موثوقة ذات عوائد دورية مدعومة بأصول واقعية',
    searchPlaceholder: 'البحث عن أصل، موقع، أو رمز...',
    allAssets: 'جميع الأصول',
    realEstate: 'العقارات',
    goldCommodities: 'الذهب والمعادن',
    cleanEnergy: 'الطاقة النظيفة',
    agriculture: 'الزراعة الحديثة',
    projectEquity: 'حصص المشاريع',
    annualAPY: 'العائد السنوي المتوقع',
    totalValuation: 'القيمة الإجمالية',
    tokenPrice: 'سعر السهم الرقمي',
    funded: 'تم التمويل',
    viewDetails: 'معاينة الصكوك والاستثمار',
    investNow: 'استثمر الآن',
    connectWallet: 'ربط المحفظة',
    connected: 'متصل',
    googleLogin: 'تسجيل الدخول عبر Google',
    signOut: 'تسجيل الخروج',
    roleInvestor: 'المستثمر / المشتري',
    roleIssuer: 'مالك الأصل / المصدر',
    roleRegulator: 'الجهة الرقابية والمدقق',
    roleAdmin: 'إدارة الشبكة والمنصة',
    switchRole: 'تغيير دور المستخدم',
    themeToggle: 'تغيير المظهر (نهار / ليل)',
    legalCompliance: 'الامتثال القانوني',
    auditBadge: 'موثق بصكوك رسمية وتدقيق قضائي',
    networkName: 'شبكة البلوكتشين',
    tokenSymbol: 'رمز التوكن',
    regulatorTitle: 'بوابة الرقابة والامتثال القانوني',
    regulatorDesc: 'مراجعة سندات الملكية والتقارير العقارية وإصدار تصاريح التوكن الرسمية',
    approveCompliance: 'الموافقة على الامتثال ومنح الترخيص',
    pendingCompliance: 'قيد المراجعة الرقابية',
    complianceApproved: 'معتمد رسمياً وممتثل',
    adminTitle: 'لوحة تحكم إدارة الشبكة',
    adminDesc: 'مراقبة العقود الذكية والرسوم وحركة المعاملات عبر المنصة'
  },
  tr: {
    appName: 'WeSee',
    tagline: 'Gerçek Dünya Varlıkları (RWA) Tokenizasyon Platformu',
    domainBadge: 'wesee.ir',
    heroBadge: 'Fiziksel Varlıklar İçin Küresel Likidite ve Tokenizasyon',
    heroTitle1: 'Gerçek Dünya Varlıklarını Tokenlaştırın',
    heroTitle2: '(RWA)',
    heroDesc: 'Gayrimenkul, sertifikalı altın külçeleri ve temiz enerji projelerini Polygon ve BNB Chain üzerinde güvenli dijital paylara dönüştürün.',
    tokenizeNewAsset: 'Yeni Varlık Tokenlaştır',
    exploreAssets: 'Varlıkları Keşfet',
    howItWorks: 'Nasıl Çalışır',
    standards: 'Uyumluluk ve Güvenlik',
    catalogTitle: 'RWA Varlık Pazarı',
    catalogSubtitle: 'Fiziksel güvenceli ve düzenli getiri sunan kurumsal düzeyde yatırım fırsatları.',
    searchPlaceholder: 'İsim, konum veya sembol ile arayın...',
    allAssets: 'Tüm Varlıklar',
    realEstate: 'Gayrimenkul',
    goldCommodities: 'Altın & Madenler',
    cleanEnergy: 'Temiz Enerji',
    agriculture: 'Tarım',
    projectEquity: 'Şirket Hisseleri',
    annualAPY: 'Beklenen Yıllık Getiri',
    totalValuation: 'Toplam Değerleme',
    tokenPrice: 'Token Birim Fiyatı',
    funded: 'Fonlandı',
    viewDetails: 'Resmi Belgeleri Gör & Yatırım Yap',
    investNow: 'Yatırım Yap',
    connectWallet: 'Cüzdanı Bağla',
    connected: 'Bağlandı',
    googleLogin: 'Google ile Giriş Yap',
    signOut: 'Çıkış Yap',
    roleInvestor: 'Yatırımcı / Alıcı',
    roleIssuer: 'Varlık Sahibi / İhraççı',
    roleRegulator: 'Düzenleyici & Denetçi',
    roleAdmin: 'Ağ ve Platform Yöneticisi',
    switchRole: 'Kullanıcı Rolünü Değiştir',
    themeToggle: 'Tema Değiştir (Gece / Gündüz)',
    legalCompliance: 'Yasal Uyumluluk',
    auditBadge: 'Resmi Tapu ve Bilirkişi Onaylı',
    networkName: 'Blokzincir Ağı',
    tokenSymbol: 'Token Sembolü',
    regulatorTitle: 'Denetim ve Yasal Uyumluluk Paneli',
    regulatorDesc: 'Resmi tapuları ve bilirkişi raporlarını inceleyin ve token onay lisansını verin.',
    approveCompliance: 'Yasal Uyumluluğu Onayla',
    pendingCompliance: 'Denetim Bekleniyor',
    complianceApproved: 'Resmi Olarak Onaylandı',
    adminTitle: 'Ağ ve Platform Yönetim Konsolu',
    adminDesc: 'Akıllı sözleşmeleri, işlem komisyonlarını ve platform parametrelerini yönetin.'
  }
};

import { RWAAsset } from './types';

export const INITIAL_RWA_ASSETS: RWAAsset[] = [
  {
    id: 'rwa-1',
    title: 'برج تجاری اداری آسمان (واحد ۴۰۲)',
    category: 'real-estate',
    categoryLabel: 'املاک و مستغلات',
    location: 'تهران، منطقه ۱ (فرشته)',
    totalValuationUSD: 1200000,
    totalValuationIRR: 72000000000,
    tokenizedPercentage: 100,
    tokenPriceUSD: 50,
    totalSupply: 24000,
    tokensSold: 18450,
    expectedAPY: 24.5,
    rentalYield: 8.2,
    network: 'polygon',
    tokenSymbol: 'WSEE-FST-402',
    tokenName: 'WeSee Fereshteh Tower 402',
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    description: 'یک واحد تجاری-اداری سند تک‌برگ در یکی از مرغوب‌ترین پهنه‌های تجاری شمال تهران با مستأجر رسمی ۳ ساله. عواید اجاره ماهانه به صورت خودکار به ولت سرمایه‌گذاران واریز می‌شود.',
    documents: [
      { title: 'سند مالکیت تک‌برگ و بنچاق ثبتی', type: 'PDF', size: '۳.۴ مگابایت' },
      { title: 'گزارش ارزیابی کارشناس رسمی دادگستری', type: 'PDF', size: '۵.۱ مگابایت' },
      { title: 'قرارداد اجاره رسمی معتبر', type: 'PDF', size: '۱.۸ مگابایت' }
    ],
    status: 'active',
    complianceStatus: 'approved',
    complianceLicenseId: 'REG-IR-2024-8842',
    issuerName: 'هلدینگ پارس ابنیه',
    minInvestmentUSD: 50
  },
  {
    id: 'rwa-2',
    title: 'سبد شمش طلای استاندارد ۲۴ عیار خزانه',
    category: 'gold',
    categoryLabel: 'طلا و فلزات گرانبها',
    location: 'خزانه امانات امنیتی شمش مرکزی',
    totalValuationUSD: 500000,
    totalValuationIRR: 30000000000,
    tokenizedPercentage: 100,
    tokenPriceUSD: 20,
    totalSupply: 25000,
    tokensSold: 21300,
    expectedAPY: 32.0,
    network: 'bsc',
    tokenSymbol: 'WSEE-GOLD-01',
    tokenName: 'WeSee Physical Gold Backed',
    contractAddress: '0x388C818CA8B9251b393131C08a7368357ab88B20',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=80',
    description: 'هر توکن معادل دقیقاً ۰.۲۵ گرم طلای خالص ۲۴ عیار با کد سریال مشخص و نگهداری در گاوصندوق امنیتی بیمه شده. با قابلیت تحویل فیزیکی شمش در مضارب ۵۰ گرمی.',
    documents: [
      { title: 'شناسنامه آزمایش عیارسنجی (ری‌گیری)', type: 'PDF', size: '۲.۱ مگابایت' },
      { title: 'بیمه‌نامه جامع سرقت و حوادث بانک', type: 'PDF', size: '۴.۰ مگابایت' }
    ],
    status: 'active',
    complianceStatus: 'approved',
    complianceLicenseId: 'REG-GOLD-7719-X',
    issuerName: 'صندوق توسعه شمش زرین',
    minInvestmentUSD: 20
  },
  {
    id: 'rwa-3',
    title: 'نیروگاه خورشیدی ۵ مگاواتی تابش کویر',
    category: 'energy',
    categoryLabel: 'انرژی پاک و تجدیدپذیر',
    location: 'یزد، شهرک تخصصی انرژی خورشیدی',
    totalValuationUSD: 850000,
    totalValuationIRR: 51000000000,
    tokenizedPercentage: 70,
    tokenPriceUSD: 100,
    totalSupply: 5950,
    tokensSold: 3200,
    expectedAPY: 28.5,
    rentalYield: 28.5,
    network: 'polygon',
    tokenSymbol: 'WSEE-SOLAR-03',
    tokenName: 'WeSee Solar Plant YExtract',
    contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
    description: 'تأمین مالی فاز توسعه پنل‌های خورشیدی با قرارداد تضمینی ۲۰ ساله خرید برق توسط وزارت نیرو (PPA). سود حاصل از فروش برق به شبکه به صورت فصلی به ولت دارندگان توکن تسویه می‌شود.',
    documents: [
      { title: 'قرارداد خرید تضمینی برق وزارت نیرو (PPA)', type: 'PDF', size: '۶.۲ مگابایت' },
      { title: 'پروانه بهره‌برداری و تأییدیه فنی سازمان انرژی', type: 'PDF', size: '۳.۹ مگابایت' }
    ],
    status: 'active',
    complianceStatus: 'approved',
    complianceLicenseId: 'REG-PWR-9920-Y',
    issuerName: 'شرکت انرژی پایدار کویر',
    minInvestmentUSD: 100
  },
  {
    id: 'rwa-4',
    title: 'باغات پسته صادراتی آرتین (۲۰ هکتار)',
    category: 'agriculture',
    categoryLabel: 'کشاورزی مدرن و باغات',
    location: 'کرمان، رفسنجان',
    totalValuationUSD: 400000,
    totalValuationIRR: 24000000000,
    tokenizedPercentage: 60,
    tokenPriceUSD: 25,
    totalSupply: 9600,
    tokensSold: 4200,
    expectedAPY: 35.0,
    network: 'bsc',
    tokenSymbol: 'WSEE-PISTA-01',
    tokenName: 'WeSee Rafsanjan Pistachio 01',
    contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80',
    description: 'مشارکت در برداشت و صادرات محصول پسته اکبری و کله‌قوچی با سیستم آبیاری تحت فشار هوشمند. تسویه سود پس از صادرات محموله به کشورهای حاشیه خلیج فارس.',
    documents: [
      { title: 'اسناد مالکیت زراعی و پروانه چاه عمیق', type: 'PDF', size: '۴.۸ مگابایت' },
      { title: 'قرارداد بازرگانی صادرات به امارات', type: 'PDF', size: '۲.۶ مگابایت' }
    ],
    status: 'active',
    complianceStatus: 'pending',
    issuerName: 'کشت و صنعت رفسنجان آرتین',
    minInvestmentUSD: 25
  },
  {
    id: 'rwa-5',
    title: 'هتل بوتیک سنتی سرای ماهور',
    category: 'real-estate',
    categoryLabel: 'املاک و گردشگری',
    location: 'شیراز، بافت تاریخی زندیه',
    totalValuationUSD: 650000,
    totalValuationIRR: 39000000000,
    tokenizedPercentage: 80,
    tokenPriceUSD: 50,
    totalSupply: 10400,
    tokensSold: 7800,
    expectedAPY: 27.0,
    rentalYield: 14.5,
    network: 'polygon',
    tokenSymbol: 'WSEE-HOTEL-SHZ',
    tokenName: 'WeSee Mahour Boutique Hotel',
    contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    description: 'ملک ثبت میراث فرهنگی با کاربری اقامتی-پذیرایی لوکس و ضریب اشغال میانگین ۷۸٪ در سال. سود ماهانه حاصل از اقامت توریست‌های خارجی به تتر تسویه می‌شود.',
    documents: [
      { title: 'سند مالکیت شش‌دانگ عرصه و اعیان', type: 'PDF', size: '۴.۱ مگابایت' },
      { title: 'مجوز بهره‌برداری گردشگری درجه یک', type: 'PDF', size: '۲.۲ مگابایت' }
    ],
    status: 'active',
    complianceStatus: 'approved',
    complianceLicenseId: 'REG-TRV-4412-Z',
    issuerName: 'توسعه گردشگری ماهور شیراز',
    minInvestmentUSD: 50
  },
  {
    id: 'rwa-6',
    title: 'سهام شرکت تولید تجهیزات پزشکی دانش‌بنیان سینا',
    category: 'equity',
    categoryLabel: 'سهام شرکت و پروژه‌ها',
    location: 'تهران، پارک فناوری پردیس',
    totalValuationUSD: 920000,
    totalValuationIRR: 55200000000,
    tokenizedPercentage: 40,
    tokenPriceUSD: 20,
    totalSupply: 18400,
    tokensSold: 3100,
    expectedAPY: 42.0,
    network: 'bsc',
    tokenSymbol: 'WSEE-MED-SINA',
    tokenName: 'WeSee Sina BioMed Shares',
    contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    description: 'عرضه ۴۰٪ از سهام خرد خط تولید ایمپلنت‌های ارتوپدی پیشرفته با مجوز غذا و دارو. بازدهی شامل سود سهام سالانه (Dividends) و رشد ارزش شرکت در بازار سلامت.',
    documents: [
      { title: 'گواهی دانش‌بنیان و پروانه وزارت بهداشت', type: 'PDF', size: '۵.۵ مگابایت' },
      { title: 'صورت‌های مالی حسابرسی‌شده ۳ سال اخیر', type: 'PDF', size: '۸.۴ مگابایت' }
    ],
    status: 'active',
    complianceStatus: 'pending',
    issuerName: 'تجهیزات پزشکی سینا طب',
    minInvestmentUSD: 20
  }
];

export const AVAILABLE_MARKETS: import('./types').TargetMarket[] = [
  // CEX Iran
  {
    id: 'abantether',
    name: 'AbanTether',
    nameFa: 'آبان‌تتر',
    type: 'iran-cex',
    badge: 'پیشنهادی ایران',
    description: 'بازار پیشرو تبادل توکن با نقدینگی بالا، تسویه ریالی آنی و پذیرنده پروژه‌های ملی',
    popular: true
  },
  {
    id: 'nobitex',
    name: 'Nobitex',
    nameFa: 'نوبیتکس',
    type: 'iran-cex',
    badge: 'بازار معاملاتی',
    description: 'بازار معاملاتی پیشرفته، دفتر سفارشات (Order Book) فعال و بیشترین کاربر داخلی',
    popular: true
  },
  {
    id: 'wallex',
    name: 'Wallex',
    nameFa: 'والکس',
    type: 'iran-cex',
    badge: 'امنیت نهادی',
    description: 'پلتفرم تبادل کریپتو با استانداردهای ذخیره‌سازی سرد و کیف‌پول‌های امن اختصاصی'
  },
  {
    id: 'tabdeel',
    name: 'Tabdeel',
    nameFa: 'تبدیل',
    type: 'iran-cex',
    badge: 'تنوع بازارها',
    description: 'تنوع جفت‌ارزهای معاملاتی با ابزارهای مدیریت ریسک و استاپ‌لاس'
  },
  {
    id: 'bitpin',
    name: 'Bitpin',
    nameFa: 'بیت‌پین',
    type: 'iran-cex',
    badge: 'جامعه جوان',
    description: 'پلتفرم سریع خرید و فروش کریپتو با پشتیبانی فعال و کامیونیتی وب۳'
  },

  // Global CEX (Iran-friendly / Accessible)
  {
    id: 'coinex',
    name: 'CoinEx',
    nameFa: 'کوینکس',
    type: 'global-cex',
    badge: 'بین‌المللی سازگار',
    description: 'اکسچنج جهانی با دسترسی آزاد برای کاربران ایرانی، پشتیبانی زبان فارسی و بیش از ۷۰۰ بازار',
    popular: true
  },
  {
    id: 'lbank',
    name: 'LBank',
    nameFa: 'ال‌بانک',
    type: 'global-cex',
    badge: 'مارکت جهانی',
    description: 'صرافی رده‌بالا با دسترسی سریع به سرمایه‌گذاران بین‌المللی و کارمزد رقابتی'
  },
  {
    id: 'bingx',
    name: 'BingX',
    nameFa: 'بینگ‌ایکس',
    type: 'global-cex',
    badge: 'اسپات و فیوچرز',
    description: 'پلتفرم محبوب بین‌المللی با ابزارهای کپی‌ترید و حجم معاملات بالا'
  },
  {
    id: 'mexc',
    name: 'MEXC Global',
    nameFa: 'مکسی',
    type: 'global-cex',
    badge: 'لیستینگ پرسرعت',
    description: 'پایگاه اصلی معرفی و کشف توکن‌های نوظهور و پروژه‌های وب۳ در جهان'
  },

  // Decentralized DEX
  {
    id: 'uniswap',
    name: 'Uniswap V3',
    nameFa: 'یونی‌سواپ',
    type: 'dex',
    badge: 'عمیق‌ترین نقدینگی DEX',
    description: 'استخر نقدینگی خودکار (AMM) روی شبکه‌های پالیگان و اتریوم بدون نیاز به مجوز واسطه',
    popular: true
  },
  {
    id: 'pancakeswap',
    name: 'PancakeSwap',
    nameFa: 'پنکیک‌سواپ',
    type: 'dex',
    badge: 'DEX شماره ۱ بوشبکه BNB',
    description: 'بزرگترین صرافی غیرمتمرکز شبکه بایننس اسمارت چین با کارمزد بسیار پایین'
  },
  {
    id: 'quickswap',
    name: 'QuickSwap',
    nameFa: 'کوئیک‌سواپ',
    type: 'dex',
    badge: 'بومی پالیگان',
    description: 'صرافی غیرمتمرکز سریع و اختصاصی شبکه Polygon با کارمزد صدم سنت'
  }
];

export const INITIAL_LISTING_APPLICATIONS: import('./types').ListingApplication[] = [
  {
    id: 'lst-app-1',
    trackingCode: 'LST-WSEE-8841',
    createdAt: '۱۴۰۳/۰۸/۱۶',
    status: 'sent_to_exchanges',
    statusLabelFa: 'ارسال مدارک به کارگروه پذیرش',
    targetMarkets: ['abantether', 'coinex', 'uniswap'],
    requestTopic: 'پذیرش توکن منتشرشده در بازار آبان',
    applicantRole: 'ناشر توکن',
    entityName: 'هلدینگ توسعه سرمایه فرشته',
    nationalId: '14008920192',
    representativeName: 'مهندس بهزاد پارسا',
    representativePhone: '09121112233',
    representativeEmail: 'b.parsa.holding@gmail.com',
    projectWebsite: 'https://wesee.ir',
    tokenName: 'WeSee Fereshteh Tower 402',
    tokenSymbol: 'WSEE-FST-402',
    tokenCurrentStatus: 'منتشر شده و در حال معامله است',
    underlyingAssetCategory: 'املاک و مستغلات',
    underlyingAssetIntro: 'یک واحد اداری تجاری در طبقه چهارم مجتمع تجاری آسمان فرشته به متراژ ۱۸۵ متر با سند رسمی تک برگ',
    tokenHolderRights: ['مالکیت تمام یا بخشی از دارایی', 'سهم از درآمد یا منافع اقتصادی'],
    assetOwnerOrObligor: 'هلدینگ توسعه سرمایه فرشته',
    ownershipProofStatus: 'بله، سند تک‌برگ و کارشناسی رسمی دادگستری ضمیمه شده است',
    tokenEconomicsSummary: 'ارزش ۲.۵ میلیون دلار، ۵۰ هزار توکن با قیمت پایه ۵۰ دلار',
    blockchainNetwork: 'polygon',
    smartContractAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    regulatoryStatus: 'مجوز یا تأییدیه مرتبط دریافت شده است',
    availableDocuments: ['معرفی‌نامه یا طرح تجاری پروژه', 'سپیدنامه (Whitepaper)', 'اسناد مالکیت یا حقوق دارایی پایه', 'گزارش ممیزی امنیتی'],
    documentsDriveLink: 'https://drive.google.com/drive/folders/1vLQyb1Auzk3DYmOc2zRiaYWO2oCbsb5o',
    expectedListingTimeline: 'هم‌اکنون آماده بررسی هستیم',
    additionalNotes: 'تقاضای راه‌اندازی جفت ارز WSEE/USDT و WSEE/IRT در بازار تتری و تومانی',
    termsConfirmed: true
  },
  {
    id: 'lst-app-2',
    trackingCode: 'LST-WSEE-4420',
    createdAt: '۱۴۰۳/۰۸/۱۸',
    status: 'under_review',
    statusLabelFa: 'در حال ارزیابی حقوقی و فنی اولیه',
    targetMarkets: ['abantether', 'nobitex', 'lbank'],
    requestTopic: 'پذیرش توکن در حال انتشار یا آماده انتشار',
    applicantRole: 'مالک دارایی یا حق پایه',
    entityName: 'کنسرسیوم طلای پارسیان',
    nationalId: '10103492810',
    representativeName: 'سید محمد حسینی',
    representativePhone: '09123334455',
    representativeEmail: 'm.hosseini.gold@gmail.com',
    projectWebsite: 'https://wesee.ir',
    tokenName: 'WeSee Physical Gold Backed',
    tokenSymbol: 'WSEE-GOLD-01',
    tokenCurrentStatus: 'طراحی شده و آماده انتشار است',
    underlyingAssetCategory: 'کالاها، فلزات و مواد اولیه',
    underlyingAssetIntro: 'سبد شمش طلای ۲۴ عیار استاندارد سپرده‌گذاری‌شده در خزانه رسمی با بیمه‌نامه معتبر سرقت',
    tokenHolderRights: ['مالکیت تمام یا بخشی از دارایی', 'حق بازخرید یا تسویه طبق قرارداد'],
    assetOwnerOrObligor: 'خزانه امانات امنیتی شمش مرکزی',
    ownershipProofStatus: 'بله، قبض انبار رسمی و شناسه آزمایشگاه ری‌گیری شمس',
    tokenEconomicsSummary: '۱ میلیون دلار شمش با پشتوانه فیزیکی دقیق هر توکن معادل ۰.۲۵ گرم طلای خالص',
    blockchainNetwork: 'bsc',
    smartContractAddress: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    regulatoryStatus: 'در محیط آزمون تنظیم‌گری (Sandbox) قرار دارد',
    availableDocuments: ['معرفی‌نامه یا طرح تجاری پروژه', 'اسناد مالکیت یا حقوق دارایی پایه', 'اسناد ثبتی و حقوقی ناشر'],
    documentsDriveLink: 'https://drive.google.com/drive/folders/1vLQyb1Auzk3DYmOc2zRiaYWO2oCbsb5o',
    expectedListingTimeline: 'تا یک ماه آینده',
    additionalNotes: 'آمادگی همکاری برای بازارگردانی و ایجاد عمق سفارشات',
    termsConfirmed: true
  }
];


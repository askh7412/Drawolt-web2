import { Locale } from './types';

export interface TranslationDictionary {
  nav: {
    products: string;
    topline: string;
    network: string;
    warranty: string;
    architecture: string;
    partnerHub: string;
  };
  langModal: {
    title: string;
    subtitle: string;
    continueBtn: string;
    dismissBtn: string;
  };
  scene1: {
    kicker: string;
    skip: string;
    statement: string;
    logoSlotNotice: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    viewPhoto: string;
    view3d: string;
    seriesStandard: string;
    seriesTopline: string;
    hotspotMotor: string;
    hotspotMotorDesc: string;
    hotspotClutch: string;
    hotspotClutchDesc: string;
    hotspotBattery: string;
    hotspotBatteryDesc: string;
    specNote: string;
  };
  collections: {
    sectionTitle: string;
    sectionSubtitle: string;
    filterAll: string;
    sampleNotice: string;
    exploreSeries: string;
  };
  engineering: {
    sectionTitle: string;
    sectionSubtitle: string;
    specsDisclaimer: string;
    tabs: {
      motor: string;
      battery: string;
      torque: string;
      ergonomics: string;
      materials: string;
    };
  };
  topline: {
    kicker: string;
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    paletteNote: string;
  };
  network: {
    sectionTitle: string;
    sectionSubtitle: string;
    filterAll: string;
    filterDealer: string;
    filterService: string;
    countryLabel: string;
    allCountries: string;
    verifiedOnlyNotice: string;
  };
  warranty: {
    sectionTitle: string;
    sectionSubtitle: string;
    tabs: {
      register: string;
      verify: string;
      track: string;
      downloads: string;
    };
    serialPlaceholder: string;
    verifyButton: string;
    trackPlaceholder: string;
    trackButton: string;
  };
  partnership: {
    headline: string;
    subtitle: string;
    distributorBtn: string;
    serviceBtn: string;
  };
  footer: {
    tagline: string;
    publicGroup: string;
    portalsGroup: string;
    architectureLink: string;
    portalsLink: string;
    languageLabel: string;
    copyright: string;
  };
  assistant: {
    buttonLabel: string;
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    disclaimer: string;
  };
}

export const DICTIONARIES: Record<Locale, TranslationDictionary> = {
  en: {
    nav: {
      products: 'Products',
      topline: 'TOP LINE',
      network: 'Network',
      warranty: 'Warranty',
      architecture: 'System Blueprint',
      partnerHub: 'Partner Hub',
    },
    langModal: {
      title: 'Choose your preferred language',
      subtitle: 'DRAWOLT Global Platform supports four regional languages with localized layout direction.',
      continueBtn: 'Continue',
      dismissBtn: 'Keep English',
    },
    scene1: {
      kicker: 'DRAWOLT Industrial Platform',
      skip: 'Skip Intro',
      statement: 'Precision mechanical architecture built for global professionals.',
      logoSlotNotice: 'Official vector emblem slot ready for approved DRAWOLT Lion/D SVG files.',
    },
    hero: {
      headline: "Engineered for What's Next.",
      subheadline: 'Power. Precision. Confidence.',
      description:
        'Modular industrial power tools, certified service operations, and enterprise dealer distribution unified under one precision digital architecture.',
      ctaPrimary: 'Explore Products',
      ctaSecondary: 'Become a Partner',
      viewPhoto: 'Studio View',
      view3d: 'Interactive 3D',
      seriesStandard: 'DRAWOLT Standard',
      seriesTopline: 'TOP LINE Titanium',
      hotspotMotor: 'Brushless Motor Core',
      hotspotMotorDesc: 'High-efficiency stator architecture engineered for sustained thermal stability.',
      hotspotClutch: 'Precision Torque Collar',
      hotspotClutchDesc: 'Multi-stage mechanical clutch assembly for repeatable industrial fastening.',
      hotspotBattery: 'Modular Power Pack',
      hotspotBatteryDesc: 'Protected cell housing with integrated charge telemetry interface.',
      specNote: 'Interactive engineering model. Verified laboratory specifications are published per SKU.',
    },
    collections: {
      sectionTitle: 'Industrial Product Collections',
      sectionSubtitle: 'Database-managed product families across DRAWOLT Standard and TOP LINE.',
      filterAll: 'All Collections',
      sampleNotice: 'Demonstration catalog entries shown for architectural preview. Production specs load from PIM.',
      exploreSeries: 'Inspect Collection',
    },
    engineering: {
      sectionTitle: 'Engineering Showcase',
      sectionSubtitle: 'Explore core mechanical subsystems and industrial build architecture.',
      specsDisclaimer: 'Subsystem architecture overview. Verified SKU metrics are published only after QA sign-off.',
      tabs: {
        motor: 'Motor Technology',
        battery: 'Battery Systems',
        torque: 'Torque & Power',
        ergonomics: 'Ergonomics & Safety',
        materials: 'Materials',
      },
    },
    topline: {
      kicker: 'Flagship Industrial Series',
      title: 'DRAWOLT TOP LINE',
      subtitle: 'Titanium. Carbon Black. Uncompromising endurance.',
      description:
        'Engineered for continuous heavy-duty industrial environments with brushed titanium housings, carbon-reinforced grips, and restrained 2–4% lime precision markers.',
      cta: 'Inspect TOP LINE Architecture',
      paletteNote: 'Approved Default Palette: Titanium #777E87 · Carbon Black #15171A · Lime Accent #9DCB16',
    },
    network: {
      sectionTitle: 'International Partner Network',
      sectionSubtitle: 'Directory structured for verified authorized sales dealers and service centers.',
      filterAll: 'All Partners',
      filterDealer: 'Sales Dealers',
      filterService: 'Service Centers',
      countryLabel: 'Region Filter',
      allCountries: 'All Regions',
      verifiedOnlyNotice: 'Map displays sample directory slots labeled clearly. Production mode shows only admin-verified partners.',
    },
    warranty: {
      sectionTitle: 'DRAWOLT ID, Warranty & Service',
      sectionSubtitle: 'Serial ownership verification, auditable 14-step repair tracking, and technical documentation.',
      tabs: {
        register: 'Product Registration',
        verify: 'Warranty Verification',
        track: 'Repair Tracking',
        downloads: 'Technical Downloads',
      },
      serialPlaceholder: 'Enter DRAWOLT Serial (e.g. DW-TL-2026-00419)',
      verifyButton: 'Verify Ownership',
      trackPlaceholder: 'Enter Tracking ID (e.g. SRV-2026-8841)',
      trackButton: 'Track Repair',
    },
    partnership: {
      headline: 'Grow with DRAWOLT.',
      subtitle:
        'Join our international network of authorized industrial distributors and certified repair centers with isolated enterprise portals.',
      distributorBtn: 'Become a Distributor',
      serviceBtn: 'Become a Service Partner',
    },
    footer: {
      tagline: 'International industrial power tools, enterprise dealership, and authorized service ecosystem.',
      publicGroup: 'Platform',
      portalsGroup: 'Enterprise Systems',
      architectureLink: 'Architecture & ERD',
      portalsLink: 'Dealer & Service Portals',
      languageLabel: 'Language',
      copyright: 'DRAWOLT Industrial Platform. Official drawolt.com digital architecture.',
    },
    assistant: {
      buttonLabel: 'DRAWOLT Assistant',
      title: 'DRAWOLT Technical Assistant',
      subtitle: 'Multilingual product, warranty & partnership guidance',
      placeholder: 'Ask about DRAWOLT tools, warranty, or partnership...',
      send: 'Send',
      disclaimer: 'Verified guidance only. Never invents unverified specs or financial approvals.',
    },
  },
  fa: {
    nav: {
      products: 'محصولات',
      topline: 'سری TOP LINE',
      network: 'شبکه نمایندگان',
      warranty: 'گارانتی و خدمات',
      architecture: 'معماری سیستم',
      partnerHub: 'پرتال همکاران',
    },
    langModal: {
      title: 'زبان مورد نظر خود را انتخاب کنید',
      subtitle: 'پلتفرم جهانی DRAWOLT از چهار زبان با چیدمان راست‌به‌چپ و چپ‌به‌راست پشتیبانی می‌کند.',
      continueBtn: 'ادامه',
      dismissBtn: 'ماندن روی انگلیسی',
    },
    scene1: {
      kicker: 'پلتفرم صنعتی DRAWOLT',
      skip: 'رد کردن مقدمه',
      statement: 'معماری دقیق مکانیکی ساخته شده برای متخصصان صنعتی در سراسر جهان.',
      logoSlotNotice: 'جایگاه رسمی وکتور لوگوی شیر و حرف D برند DRAWOLT آماده جایگذاری فایل تاییدشده است.',
    },
    hero: {
      headline: 'مهندسی‌شده برای آینده صنعت.',
      subheadline: 'قدرت. دقت. اطمینان.',
      description:
        'ابزارهای برقی و شارژی صنعتی، عملیات خدمات مجاز و توزیع سازمانی نمایندگان در یک معماری دیجیتال یکپارچه.',
      ctaPrimary: 'مشاهده محصولات',
      ctaSecondary: 'درخواست همکاری',
      viewPhoto: 'نمای استودیویی',
      view3d: 'نمای سه‌بعدی تعاملی',
      seriesStandard: 'سری استاندارد DRAWOLT',
      seriesTopline: 'تیتانیوم TOP LINE',
      hotspotMotor: 'هسته موتور براشلس',
      hotspotMotorDesc: 'طراحی استاتور با راندمان بالا برای پایداری حرارتی مداوم.',
      hotspotClutch: 'رینگ گشتاور دقیق',
      hotspotClutchDesc: 'کلاچ مکانیکی چندمرحله‌ای برای دقت تکرارپذیر در کارهای صنعتی.',
      hotspotBattery: 'پکیج باتری ماژولار',
      hotspotBatteryDesc: 'محفظه محافظ سلول‌ها به همراه رابط پایش شارژ و دما.',
      specNote: 'مدل نمایشی تعاملی مهندسی. مشخصات آزمایشگاهی تاییدشده برای هر کد کالا منتشر می‌شود.',
    },
    collections: {
      sectionTitle: 'دسته‌بندی محصولات صنعتی',
      sectionSubtitle: 'مجموعه‌های قابل مدیریت از دیتابیس در دو خط تولید استاندارد و TOP LINE.',
      filterAll: 'همه دسته‌ها',
      sampleNotice: 'اقلام نمایشی صرفاً برای پیش‌نمایش معماری هستند. مشخصات واقعی از سامانه PIM بارگذاری می‌شوند.',
      exploreSeries: 'بررسی مجموعه',
    },
    engineering: {
      sectionTitle: 'ویترین مهندسی و فناوری',
      sectionSubtitle: 'بررسی زیرسیستم‌های مکانیکی و ساختار مهندسی ابزارهای صنعتی.',
      specsDisclaimer: 'نمای کلی معماری زیرسیستم‌ها. اعداد دقیق پس از تایید واحد کنترل کیفیت درج می‌شوند.',
      tabs: {
        motor: 'فناوری موتور',
        battery: 'سیستم‌های باتری',
        torque: 'گشتاور و توان',
        ergonomics: 'ارگونومی و ایمنی',
        materials: 'متریال و بدنه',
      },
    },
    topline: {
      kicker: 'سری پرچمدار صنعتی',
      title: 'DRAWOLT TOP LINE',
      subtitle: 'تیتانیوم. مشکی کربنی. دوام بی‌وقفه.',
      description:
        'طراحی‌شده برای کاربری مداوم و سنگین صنعتی با بدنه تیتانیوم برس‌خورده، گریپ کربنی و ۲ تا ۴ درصد تاکید رنگ سبز لیمویی.',
      cta: 'بررسی معماری TOP LINE',
      paletteNote: 'پالت مصوب: تیتانیوم #777E87 · مشکی کربنی #15171A · سبز لیمویی #9DCB16',
    },
    network: {
      sectionTitle: 'شبکه بین‌المللی نمایندگان',
      sectionSubtitle: 'ساختار دایرکتوری برای نمایش نمایندگان فروش و مراکز خدمات مجاز تاییدشده.',
      filterAll: 'همه شرکا',
      filterDealer: 'نمایندگان فروش',
      filterService: 'مراکز خدمات مجاز',
      countryLabel: 'فیلتر منطقه',
      allCountries: 'همه مناطق',
      verifiedOnlyNotice: 'نقاط نقشه دارای برچسب نمونه هستند. در محیط عملیاتی فقط شرکای تاییدشده توسط ادمین نمایش داده می‌شوند.',
    },
    warranty: {
      sectionTitle: 'شناسه DRAWOLT، گارانتی و خدمات',
      sectionSubtitle: 'احراز اصالت سریال، پیگیری ۱۴ مرحله‌ای تعمیرات و مرکز دانلود اسناد فنی.',
      tabs: {
        register: 'ثبت محصول',
        verify: 'استعلام گارانتی',
        track: 'پیگیری تعمیر',
        downloads: 'اسناد فنی',
      },
      serialPlaceholder: 'شماره سریال را وارد کنید (مثلاً DW-TL-2026-00419)',
      verifyButton: 'بررسی اصالت و گارانتی',
      trackPlaceholder: 'کد رهگیری تعمیر (مثلاً SRV-2026-8841)',
      trackButton: 'پیگیری وضعیت',
    },
    partnership: {
      headline: 'همراه با DRAWOLT رشد کنید.',
      subtitle:
        'به شبکه بین‌المللی توزیع‌کنندگان مجاز و مراکز خدمات فنی DRAWOLT با پرتال‌های اختصاصی و ایزوله بپیوندید.',
      distributorBtn: 'درخواست نمایندگی فروش',
      serviceBtn: 'درخواست مرکز خدمات مجاز',
    },
    footer: {
      tagline: 'اکوسیستم بین‌المللی ابزارهای صنعتی، مدیریت فروش نمایندگان و مراکز خدمات مجاز.',
      publicGroup: 'پلتفرم',
      portalsGroup: 'سامانه‌های سازمانی',
      architectureLink: 'معماری و ERD دیتابیس',
      portalsLink: 'پرتال فروش و خدمات',
      languageLabel: 'زبان',
      copyright: 'پلتفرم صنعتی DRAWOLT — معماری دیجیتال رسمی drawolt.com',
    },
    assistant: {
      buttonLabel: 'دستیار DRAWOLT',
      title: 'دستیار هوشمند فنی DRAWOLT',
      subtitle: 'راهنمای چندزبانه محصولات، گارانتی و همکاری',
      placeholder: 'درباره ابزارها، گارانتی یا همکاری سوال بپرسید...',
      send: 'ارسال',
      disclaimer: 'پاسخگویی مستند و بدون جعل مشخصات فنی یا تاییدیه‌های مالی.',
    },
  },
  de: {
    nav: {
      products: 'Produkte',
      topline: 'TOP LINE',
      network: 'Netzwerk',
      warranty: 'Garantie',
      architecture: 'Systemarchitektur',
      partnerHub: 'Partner-Portal',
    },
    langModal: {
      title: 'Wählen Sie Ihre bevorzugte Sprache',
      subtitle: 'Die globale DRAWOLT-Plattform unterstützt vier Sprachen mit lokalisierter Darstellung.',
      continueBtn: 'Fortfahren',
      dismissBtn: 'Englisch behalten',
    },
    scene1: {
      kicker: 'DRAWOLT Industrieplattform',
      skip: 'Intro überspringen',
      statement: 'Präzisionsmechanik für professionelle Industrieanwender weltweit.',
      logoSlotNotice: 'Offizieller Vektor-Platzhalter für die freigegebenen DRAWOLT Löwe/D-SVG-Dateien.',
    },
    hero: {
      headline: 'Entwickelt für die nächste Generation.',
      subheadline: 'Kraft. Präzision. Vertrauen.',
      description:
        'Modulare Industriewerkzeuge, zertifizierter Servicebetrieb und Enterprise-Händlervertrieb in einer präzisen digitalen Plattform.',
      ctaPrimary: 'Produkte entdecken',
      ctaSecondary: 'Partner werden',
      viewPhoto: 'Studio-Ansicht',
      view3d: 'Interaktives 3D',
      seriesStandard: 'DRAWOLT Standard',
      seriesTopline: 'TOP LINE Titan',
      hotspotMotor: 'Bürstenloser Motorkern',
      hotspotMotorDesc: 'Hocheffiziente Statorarchitektur für konstante thermische Stabilität.',
      hotspotClutch: 'Präzisions-Drehmomentring',
      hotspotClutchDesc: 'Mehrstufige mechanische Kupplung für reproduzierbare Industrieverschraubungen.',
      hotspotBattery: 'Modulares Akkusystem',
      hotspotBatteryDesc: 'Geschütztes Zellgehäuse mit integrierter Ladetelemetrie.',
      specNote: 'Interaktives Engineering-Modell. Geprüfte Labordaten werden pro Artikelnummer veröffentlicht.',
    },
    collections: {
      sectionTitle: 'Industrielle Produktkollektionen',
      sectionSubtitle: 'Datenbankgestützte Produktfamilien für DRAWOLT Standard und TOP LINE.',
      filterAll: 'Alle Kategorien',
      sampleNotice: 'Demoeinträge zur Architekturvorschau. Produktivdaten werden aus dem PIM geladen.',
      exploreSeries: 'Kategorie prüfen',
    },
    engineering: {
      sectionTitle: 'Engineering-Technologie',
      sectionSubtitle: 'Entdecken Sie mechanische Kernsysteme und industrielle Fertigungsstandards.',
      specsDisclaimer: 'Systemarchitektur-Übersicht. Verbindliche Messwerte folgen nach QA-Freigabe.',
      tabs: {
        motor: 'Motortechnologie',
        battery: 'Akkusysteme',
        torque: 'Drehmoment & Leistung',
        ergonomics: 'Ergonomie & Sicherheit',
        materials: 'Werkstoffe',
      },
    },
    topline: {
      kicker: 'Flaggschiff-Industrieserie',
      title: 'DRAWOLT TOP LINE',
      subtitle: 'Titan. Carbonschwarz. Kompromisslose Ausdauer.',
      description:
        'Konzipiert für den industriellen Dauereinsatz mit gebürstetem Titangehäuse, carbonverstärktem Griff und dezenten 2–4% Lime-Akzenten.',
      cta: 'TOP LINE Architektur ansehen',
      paletteNote: 'Freigegebene Palette: Titan #777E87 · Carbonschwarz #15171A · Lime #9DCB16',
    },
    network: {
      sectionTitle: 'Internationales Partnernetzwerk',
      sectionSubtitle: 'Verzeichnisstruktur für geprüfte Vertriebspartner und autorisierte Servicezentren.',
      filterAll: 'Alle Partner',
      filterDealer: 'Vertriebspartner',
      filterService: 'Servicezentren',
      countryLabel: 'Regionsfilter',
      allCountries: 'Alle Regionen',
      verifiedOnlyNotice: 'Beispieleinträge sind markiert. Im Produktivbetrieb erscheinen nur verifizierte Partner.',
    },
    warranty: {
      sectionTitle: 'DRAWOLT ID, Garantie & Service',
      sectionSubtitle: 'Seriennummern-Verifizierung, 14-stufige Reparaturverfolgung und technische Downloads.',
      tabs: {
        register: 'Produktregistrierung',
        verify: 'Garantieprüfung',
        track: 'Reparaturstatus',
        downloads: 'Downloads',
      },
      serialPlaceholder: 'Seriennummer eingeben (z. B. DW-TL-2026-00419)',
      verifyButton: 'Seriennummer prüfen',
      trackPlaceholder: 'Tracking-ID eingeben (z. B. SRV-2026-8841)',
      trackButton: 'Status abrufen',
    },
    partnership: {
      headline: 'Wachsen Sie mit DRAWOLT.',
      subtitle:
        'Werden Sie Teil unseres internationalen Netzwerks aus autorisierten Fachhändlern und zertifizierten Servicezentren.',
      distributorBtn: 'Vertriebspartner werden',
      serviceBtn: 'Servicepartner werden',
    },
    footer: {
      tagline: 'Internationale Industriewerkzeuge, Händlerportal und zertifiziertes Service-Ökosystem.',
      publicGroup: 'Plattform',
      portalsGroup: 'Enterprise-Systeme',
      architectureLink: 'Architektur & ERD',
      portalsLink: 'Händler- & Serviceportale',
      languageLabel: 'Sprache',
      copyright: 'DRAWOLT Industrial Platform. Offizielle digitale Architektur für drawolt.com.',
    },
    assistant: {
      buttonLabel: 'DRAWOLT Assistent',
      title: 'DRAWOLT Technik-Assistent',
      subtitle: 'Mehrsprachige Produkt-, Garantie- & Partnerberatung',
      placeholder: 'Fragen zu Werkzeugen, Garantie oder Partnerschaft...',
      send: 'Senden',
      disclaimer: 'Nur verifizierte Auskünfte. Keine erfundenen Spezifikationen oder Zusagen.',
    },
  },
  ar: {
    nav: {
      products: 'المنتجات',
      topline: 'سلسلة TOP LINE',
      network: 'شبكة الشركاء',
      warranty: 'الضمان والخدمة',
      architecture: 'بنية النظام',
      partnerHub: 'بوابة الشركاء',
    },
    langModal: {
      title: 'اختر لغتك المفضلة',
      subtitle: 'تدعم منصة DRAWOLT العالمية أربع لغات مع اتجاه عرض مخصص لكل لغة.',
      continueBtn: 'متابعة',
      dismissBtn: 'الاستمرار بالإنجليزية',
    },
    scene1: {
      kicker: 'منصة DRAWOLT الصناعية',
      skip: 'تخطي المقدمة',
      statement: 'هندسة ميكانيكية دقيقة مصممة للمحترفين في القطاع الصناعي حول العالم.',
      logoSlotNotice: 'مساحة الشعار المتجهي جاهزة لاستقبال ملفات شعار DRAWOLT الرسمية المعتمدة.',
    },
    hero: {
      headline: 'هندسة للمستقبل الصناعي.',
      subheadline: 'قوة. دقة. موثوقية.',
      description:
        'أدوات كهربائية صناعية، عمليات صيانة معتمدة، وإدارة موزعين مؤسسية ضمن منظومة رقمية متكاملة.',
      ctaPrimary: 'استكشاف المنتجات',
      ctaSecondary: 'كن شريكاً معنا',
      viewPhoto: 'عرض الاستوديو',
      view3d: 'عرض ثلاثي الأبعاد',
      seriesStandard: 'DRAWOLT القياسية',
      seriesTopline: 'TOP LINE تيتانيوم',
      hotspotMotor: 'قلب المحرك عديم الفحمات',
      hotspotMotorDesc: 'هندسة عضو ساكن عالية الكفاءة لاستقرار حراري مستدام.',
      hotspotClutch: 'طوق عزم الدوران الدقيق',
      hotspotClutchDesc: 'مجموعة قابض ميكانيكي متعددة المراحل لربط صناعي متكرر الدقة.',
      hotspotBattery: 'حزمة البطارية المعيارية',
      hotspotBatteryDesc: 'هيكل حماية للخلايا مع واجهة متكاملة لمراقبة الشحن.',
      specNote: 'نموذج هندسي تفاعلي. تُنشر المواصفات المخبرية المعتمدة لكل طراز على حدة.',
    },
    collections: {
      sectionTitle: 'مجموعات الأدوات الصناعية',
      sectionSubtitle: 'فئات منتجات قابلة للإدارة من قاعدة البيانات ضمن سلسلتي Standard و TOP LINE.',
      filterAll: 'جميع المجموعات',
      sampleNotice: 'بيانات عرض توضيحية لمعاينة البنية. تُحمّل المواصفات الفعلية من نظام PIM.',
      exploreSeries: 'استعراض المجموعة',
    },
    engineering: {
      sectionTitle: 'معرض الهندسة والتقنية',
      sectionSubtitle: 'استكشف الأنظمة الميكانيكية الأساسية ومعايير التصنيع الصناعي.',
      specsDisclaimer: 'نظرة عامة على بنية الأنظمة الفرعية. تُنشر الأرقام المعتمدة بعد فحص الجودة.',
      tabs: {
        motor: 'تقنية المحركات',
        battery: 'أنظمة البطاريات',
        torque: 'العزم والقوة',
        ergonomics: 'بيئة العمل والأمان',
        materials: 'المواد والهيكل',
      },
    },
    topline: {
      kicker: 'السلسلة الصناعية الرائدة',
      title: 'DRAWOLT TOP LINE',
      subtitle: 'تيتانيوم. أسود كربوني. تحمّل لا يساوم.',
      description:
        'مصممة لبيئات العمل الصناعية الشاقة والمستمرة بهياكل تيتانيوم مصقولة ومقابض معززة بالكربون ولمسات خضراء دقيقة.',
      cta: 'استكشاف بنية TOP LINE',
      paletteNote: 'الألوان المعتمدة: تيتانيوم #777E87 · أسود كربوني #15171A · أخضر ليموني #9DCB16',
    },
    network: {
      sectionTitle: 'شبكة الشركاء الدولية',
      sectionSubtitle: 'دليل مخصص لعرض الموزعين المعتمدين ومراكز الصيانة المرخصة فقط.',
      filterAll: 'جميع الشركاء',
      filterDealer: 'موزعو المبيعات',
      filterService: 'مراكز الخدمة',
      countryLabel: 'تصفية المنطقة',
      allCountries: 'جميع المناطق',
      verifiedOnlyNotice: 'تعرض الخريطة نماذج توضيحية حالياً؛ وفي وضع الإنتاج تظهر فقط الجهات المعتمدة.',
    },
    warranty: {
      sectionTitle: 'هوية DRAWOLT، الضمان والخدمة',
      sectionSubtitle: 'التحقق من الملكية بالرقم التسلسلي، تتبع الصيانة من 14 خطوة، والوثائق الفنية.',
      tabs: {
        register: 'تسجيل المنتج',
        verify: 'التحقق من الضمان',
        track: 'تتبع الصيانة',
        downloads: 'التحميلات الفنية',
      },
      serialPlaceholder: 'أدخل الرقم التسلسلي (مثال: DW-TL-2026-00419)',
      verifyButton: 'التحقق من الملكية',
      trackPlaceholder: 'أدخل رمز التتبع (مثال: SRV-2026-8841)',
      trackButton: 'تتبع الطلب',
    },
    partnership: {
      headline: 'انمُ مع DRAWOLT.',
      subtitle:
        'انضم إلى شبكتنا العالمية من الموزعين المعتمدين ومراكز الصيانة المرخصة عبر بوابات مؤسسية معزولة.',
      distributorBtn: 'طلب وكالة توزيع',
      serviceBtn: 'طلب مركز صيانة معتمد',
    },
    footer: {
      tagline: 'منظومة دولية للأدوات الصناعية وإدارة الوكلاء ومراكز الصيانة المعتمدة.',
      publicGroup: 'المنصة',
      portalsGroup: 'الأنظمة المؤسسية',
      architectureLink: 'البنية وقاعدة البيانات',
      portalsLink: 'بوابات المبيعات والخدمة',
      languageLabel: 'اللغة',
      copyright: 'منصة DRAWOLT الصناعية — البنية الرقمية الرسمية drawolt.com',
    },
    assistant: {
      buttonLabel: 'مساعد DRAWOLT',
      title: 'المساعد الفني من DRAWOLT',
      subtitle: 'إرشاد متعدد اللغات للمنتجات والضمان والشراكة',
      placeholder: 'اسأل عن الأدوات أو الضمان أو طلب الشراكة...',
      send: 'إرسال',
      disclaimer: 'معلومات موثقة فقط دون اختلاق مواصفات أو موافقات مالية.',
    },
  },
};

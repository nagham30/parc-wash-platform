import { supabase, supabaseConfigured } from "./supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useMemo, useRef, useState } from "react";
import gazaHygieneHero from "./assets/gaza-hygiene-hero.png";
import parcLogo from "./assets/parc-logo.png";
import careLogo from "./assets/partners/care.png";
import ochaLogo from "./assets/partners/ocha.png";
import puiLogo from "./assets/partners/pui.png";
import { LanguageSwitch, matchesLocalizedText } from "./i18n";

type IconName =
  | "drop"
  | "hand"
  | "shield"
  | "trash"
  | "search"
  | "block"
  | "check"
  | "book"
  | "poster"
  | "play"
  | "community"
  | "users"
  | "user"
  | "cap"
  | "arrow";

const photos = {
  community:
    "https://images.unsplash.com/photo-1742202618461-31f6f3584247?auto=format&fit=crop&w=1800&q=88",
  handwashing:
    "https://images.unsplash.com/photo-1683363840162-fa44480aa4ce?auto=format&fit=crop&w=1200&q=85",
  cleanWater:
    "https://images.unsplash.com/photo-1713019704587-9ca6cd08be75?auto=format&fit=crop&w=1000&q=85",
  storage:
    "https://images.unsplash.com/photo-1724349620843-99aba60eab8d?auto=format&fit=crop&w=1200&q=85",
  cleanup:
    "https://images.unsplash.com/photo-1722072577649-73a54d7f864b?auto=format&fit=crop&w=1000&q=85",
  cleanupClose:
    "https://images.unsplash.com/photo-1593113616828-6f22bca04804?auto=format&fit=crop&w=1000&q=85",
  inspection:
    "https://images.unsplash.com/photo-1727762331620-4e21746e1565?auto=format&fit=crop&w=1200&q=85",
  training:
    "https://images.unsplash.com/photo-1710093072228-8c3129f27357?auto=format&fit=crop&w=1200&q=85",
};

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    drop: (
      <path d="M12 3S6.5 9.2 6.5 14a5.5 5.5 0 0 0 11 0C17.5 9.2 12 3 12 3Zm-2.6 11.4c.2 1.5 1.2 2.5 2.7 2.8" />
    ),
    hand: (
      <path d="M7.2 12.5V7.8a1.3 1.3 0 0 1 2.6 0v3-5a1.3 1.3 0 0 1 2.6 0v5.4-4.5a1.3 1.3 0 0 1 2.6 0v4.8-3a1.3 1.3 0 0 1 2.6 0V15c0 3.5-2.2 6-6 6-2.1 0-3.6-.8-4.8-2.4l-2.2-3a1.5 1.5 0 0 1 2.3-1.9l1.5 1.5" />
    ),
    shield: (
      <path d="M12 3 5.5 5.7v5.2c0 4.4 2.6 8.2 6.5 10.1 3.9-1.9 6.5-5.7 6.5-10.1V5.7L12 3Zm-2.8 8.8 1.8 1.8 3.9-4" />
    ),
    trash: (
      <path d="M5.5 7.5h13M9 7.5V5h6v2.5m2 0-.8 13h-8.4L7 7.5m3.3 3v6.5m3.4-6.5V17" />
    ),
    search: (
      <path d="m20 20-4.4-4.4m2-5.1a7.1 7.1 0 1 1-14.2 0 7.1 7.1 0 0 1 14.2 0Z" />
    ),
    block: (
      <path d="M5 19 19 5M5.8 8.4A7.8 7.8 0 0 0 4.9 12a7.1 7.1 0 0 0 11.5 5.6M8.2 5.3A7.1 7.1 0 0 1 18.7 15" />
    ),
    check: <path d="m5 12.5 4.3 4.2L19 7" />,
    book: (
      <path d="M4 5.5c2.8-.8 5.5-.2 8 1.6v13c-2.5-1.8-5.2-2.4-8-1.6v-13Zm16 0c-2.8-.8-5.5-.2-8 1.6v13c2.5-1.8 5.2-2.4 8-1.6v-13Z" />
    ),
    poster: (
      <path d="M6 3.5h12v17H6v-17Zm3 4h6m-6 4h6m-6 4h3.5" />
    ),
    play: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m10 8.5 5 3.5-5 3.5v-7Z" />
      </>
    ),
    community: (
      <>
        <circle cx="12" cy="7" r="2.5" />
        <circle cx="5.5" cy="9" r="2" />
        <circle cx="18.5" cy="9" r="2" />
        <path d="M7.5 20v-2.5a4.5 4.5 0 0 1 9 0V20M2.5 19v-1.5a3 3 0 0 1 4.2-2.7M21.5 19v-1.5a3 3 0 0 0-4.2-2.7" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M14 14.5a4.5 4.5 0 0 1 6.5 4V20" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      </>
    ),
    cap: (
      <>
        <path d="m3 9 9-4 9 4-9 4-9-4Z" />
        <path d="M7 11v5c2.8 2 7.2 2 10 0v-5M21 9v6" />
      </>
    ),
    arrow: <path d="M19 12H5m5-5-5 5 5 5" />,
  };

  return (
    <svg
      aria-hidden="true"
      className="line-icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}

function Logo() {
  return (
    <a className="logo" href="#/" aria-label="منصة المياه والصرف الصحي وتعزيز النظافة، الرئيسية">
      <span className="logo-mark">
        <img alt="شعار جمعية التنمية الزراعية الفلسطينية - الإغاثة الزراعية" src={parcLogo} />
      </span>
      <span>منصة المياه والصرف الصحي وتعزيز النظافة</span>
    </a>
  );
}

function SocialIcon({ name }: { name: "facebook" | "linkedin" | "youtube" }) {
  const paths = {
    facebook: <path d="M14.2 8.4V6.7c0-.8.5-1 1-1h2.4V2.1L14.3 2C11 2 9.7 4 9.7 6.4v2H7v4h2.7V22h4.5v-9.6h3.1l.5-4h-3.6Z" />,
    linkedin: (
      <>
        <path d="M4.7 7.2A2.3 2.3 0 1 0 4.7 2.6a2.3 2.3 0 0 0 0 4.6ZM2.7 8.9h4V22h-4V8.9ZM9.1 8.9h3.8v1.8h.1c.5-1 1.8-2.2 3.8-2.2 4.1 0 4.8 2.7 4.8 6.2V22h-4v-6.5c0-1.6 0-3.6-2.2-3.6-2.2 0-2.5 1.7-2.5 3.5V22h-4V8.9Z" />
      </>
    ),
    youtube: <path d="M22.5 6.2a2.8 2.8 0 0 0-2-2C18.7 3.7 12 3.7 12 3.7s-6.7 0-8.5.5a2.8 2.8 0 0 0-2 2A29.4 29.4 0 0 0 1 12a29.4 29.4 0 0 0 .5 5.8 2.8 2.8 0 0 0 2 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.8 2.8 0 0 0 2-2A29.4 29.4 0 0 0 23 12a29.4 29.4 0 0 0-.5-5.8ZM9.8 15.6V8.4l6.2 3.6-6.2 3.6Z" />,
  };
  return <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">{paths[name]}</svg>;
}

const primaryNavigation = [
  ["الرئيسية", ""],
  ["الأنشطة", "activities"],
  ["التدريب", "training"],
  ["المكتبة التوعوية", "library"],
  ["الحملات", "campaigns"],
];

const moreNavigation = [
  ["الأدوات الميدانية", "field-tools"],
  ["التخطيط", "planning"],
  ["المتابعة والتقييم", "monitoring"],
  ["مركز المعرفة", "knowledge"],
  ["قصص النجاح", "campaigns"],
];

function routeHref(route: string) {
  return route ? `#/${route}` : "#/";
}

function PublicHeader({
  active = "",
  ctaLabel = "استكشف الأنشطة",
}: {
  active?: string;
  ctaLabel?: string;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
      if (!navRef.current?.contains(event.target as Node) && !toggleRef.current?.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMoreOpen(false); setMobileOpen(false); }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    const closeOnNavigation = () => { setMobileOpen(false); setMoreOpen(false); };
    window.addEventListener("hashchange", closeOnNavigation);
    return () => window.removeEventListener("hashchange", closeOnNavigation);
  }, []);

  return (
    <header className="topbar">
      <div className="container nav-wrap">
        <Logo />
        <button ref={toggleRef} className="mobile-nav-toggle" type="button" aria-label="فتح وإغلاق القائمة" aria-expanded={mobileOpen} aria-controls="public-navigation" onClick={() => setMobileOpen(!mobileOpen)}><span></span><span></span><span></span></button>
        <nav ref={navRef} id="public-navigation" className={mobileOpen ? "mobile-nav-open" : ""} aria-label="التنقل الرئيسي">
          {primaryNavigation.map(([label, route]) => (
            <a
              className={active === route || (!active && !route) ? "active" : ""}
              href={routeHref(route)}
              key={label}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className={`nav-dropdown${moreOpen ? " open" : ""}`} ref={moreRef}>
            <button
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              onClick={() => setMoreOpen((open) => !open)}
              type="button"
            >
              المزيد
            </button>
            <div className="dropdown-menu" role="menu">
              {moreNavigation.map(([label, route]) => (
                <a
                  href={routeHref(route)}
                  key={label}
                  onClick={() => { setMoreOpen(false); setMobileOpen(false); }}
                  role="menuitem"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </nav>
        <div className="nav-actions">
          <LanguageSwitch />
          <a className="button button-small button-orange" href="#/activities">
            {ctaLabel}
          </a>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="container site-footer-grid">
        <div className="site-footer-brand">
          <Logo />
          <strong>الإغاثة الزراعية الفلسطينية (PARC)</strong>
          <p>منصة توعوية مجتمعية لتعزيز ممارسات النظافة والصحة والوقاية وبناء بيئة أكثر صحة وأمانًا.</p>
          <small>معًا نحو مجتمعات أكثر صحة وأمانًا</small>
        </div>
        <div className="site-footer-column">
          <h2>روابط سريعة</h2>
          <a href="#/">الرئيسية</a>
          <a href="#/activities">الأنشطة</a>
          <a href="#/training">التدريب</a>
          <a href="#/library">المكتبة التوعوية</a>
          <a href="#/campaigns">الحملات والفعاليات</a>
          <a href="#/knowledge">مركز المعرفة</a>
          <div className="site-footer-login">
            <a href="#/login">
              <Icon name="user" size={16} />
              <span>تسجيل الدخول</span>
              <Icon name="arrow" size={15} />
            </a>
          </div>
        </div>
        <div className="site-footer-column">
          <h2>موارد المنصة</h2>
          <a href="#/field-tools">الأدوات الميدانية</a>
          <a href="#/planning">التخطيط</a>
          <a href="#/monitoring">المتابعة والتقييم</a>
          <a href="#/campaigns">قصص النجاح</a>
        </div>
        <div className="site-footer-partners" aria-label="شركاؤنا">
          <h2>شركاؤنا</h2>
          <div className="partners-logos">
            <img src={careLogo} alt="CARE" loading="lazy" />
            <img src={ochaLogo} alt="OCHA" loading="lazy" />
            <img src={puiLogo} alt="Première Urgence Internationale" loading="lazy" />
          </div>
        </div>
        <div className="site-footer-contact">
          <h2>تابع الإغاثة الزراعية</h2>
          <a className="official-site-link" href="https://pal-arc.org/ar/" target="_blank" rel="noopener noreferrer">
            زيارة الموقع الرسمي
            <span aria-hidden="true">↗</span>
          </a>
          <p>تابعنا على</p>
          <div className="social-links">
            <a aria-label="فيسبوك" href="https://www.facebook.com/parc.palestine/" target="_blank" rel="noopener noreferrer"><SocialIcon name="facebook" /></a>
            <a aria-label="لينكدإن" href="https://www.linkedin.com/company/parc-agricultural-development-association?originalSubdomain=be" target="_blank" rel="noopener noreferrer"><SocialIcon name="linkedin" /></a>
            <a aria-label="يوتيوب" href="https://www.youtube.com/channel/UCHKcgLzsNxPsxbtUt86yaSA/featured" target="_blank" rel="noopener noreferrer"><SocialIcon name="youtube" /></a>
          </div>
        </div>
      </div>
      <div className="container site-footer-bottom">
        <span>© 2026 الإغاثة الزراعية الفلسطينية (PARC). جميع الحقوق محفوظة.</span>
        <div><span>سياسة الخصوصية</span><span>شروط الاستخدام</span></div>
      </div>
    </footer>
  );
}

type AwarenessEvent = {
  id: string;
  name: string;
  day: number;
  month: number;
  category: string;
  icon: IconName;
  description: string;
  fullDescription?: string;
  image?: string;
  importance: string;
  activities: string[];
  resources: string[];
  showOnHomepage?: boolean;
};

const awarenessEvents: AwarenessEvent[] = [
  {
    id: "womens-day",
    name: "اليوم العالمي للمرأة",
    day: 8,
    month: 3,
    category: "التوعية المجتمعية",
    icon: "hand",
    description: "مناسبة عالمية للاحتفاء بدور النساء وتعزيز وصولهن إلى المعرفة والخدمات الصحية.",
    importance: "لأن تمكين النساء بالمعلومات والممارسات الصحية ينعكس مباشرة على صحة الأسرة والمجتمع.",
    activities: ["جلسة صحة الأسرة", "حوار مجتمعي حول النظافة", "نشاط قائدات التغيير"],
    resources: ["دليل النظافة الأسرية", "بطاقات رسائل صحية", "مادة تدريب الميسّرات"],
  },
  {
    id: "water-day",
    name: "اليوم العالمي للمياه",
    day: 22,
    month: 3,
    category: "المياه",
    icon: "drop",
    description: "يوم عالمي يسلّط الضوء على قيمة المياه وضرورة الوصول الآمن والمستدام إليها.",
    importance: "المياه الآمنة أساس الوقاية من الأمراض وتحسين ممارسات النظافة في المنزل والمجتمع.",
    activities: ["رحلة قطرة ماء", "فحص نقطة مياه", "جلسة التخزين الآمن للمياه"],
    resources: ["ملصق المياه الآمنة", "دليل معالجة المياه", "بطاقات جلسة مجتمعية"],
  },
  {
    id: "environment-day",
    name: "اليوم العالمي للبيئة",
    day: 5,
    month: 6,
    category: "البيئة والنفايات",
    icon: "trash",
    description: "فرصة سنوية لتحفيز العمل المجتمعي من أجل بيئة أنظف وأكثر أمانًا.",
    importance: "النظافة البيئية وإدارة النفايات تقللان التلوث ومصادر جذب القوارض والآفات.",
    activities: ["حملة بيئة نظيفة", "جولة رصد النفايات", "إزالة مصادر جذب الآفات"],
    resources: ["دليل إدارة النفايات", "ملصق الحي النظيف", "قائمة فحص البيئة"],
  },
  {
    id: "handwashing-day",
    name: "يوم غسل اليدين العالمي",
    day: 15,
    month: 10,
    category: "النظافة والصحة",
    icon: "hand",
    description: "مناسبة عالمية للتذكير بأن غسل اليدين بالماء والصابون ممارسة بسيطة تنقذ الأرواح.",
    importance: "غسل اليدين بطريقة صحيحة من أكثر وسائل الوقاية فاعلية للحد من انتقال الأمراض.",
    activities: ["تحدي غسل اليدين", "عرض عملي للأطفال", "محطة التحقق من الخطوات"],
    resources: ["ملصق خطوات غسل اليدين", "دليل جلسة توعوية", "مادة تدريب الميسّرين"],
  },
  {
    id: "toilet-day",
    name: "اليوم العالمي للمرحاض",
    day: 19,
    month: 11,
    category: "المياه والصرف الصحي",
    icon: "drop",
    description: "يوم توعوي يركز على أهمية خدمات الصرف الصحي الآمنة والكريمة للجميع.",
    importance: "الصرف الصحي المأمون يحمي المياه والبيئة ويحد من انتشار الأمراض.",
    activities: ["جولة مرافق آمنة", "جلسة تنظيف المرافق", "خريطة مخاطر الصرف الصحي"],
    resources: ["قائمة فحص المرافق", "ملصق الاستخدام الآمن", "دليل الصرف الصحي"],
  },
  {
    id: "childrens-day",
    name: "اليوم العالمي للطفل",
    day: 20,
    month: 11,
    category: "صحة الأطفال",
    icon: "shield",
    description: "مناسبة لتعزيز حقوق الأطفال في بيئة صحية وآمنة وداعمة للتعلم والنمو.",
    importance: "توفير المياه والنظافة والبيئة الآمنة للأطفال يدعم صحتهم وحضورهم المدرسي.",
    activities: ["أبطال النظافة الصغار", "تحدي الصف النظيف", "لعبة الرسائل الصحية"],
    resources: ["بطاقات نظافة للأطفال", "ملصق المدرسة الصحية", "دليل أنشطة تفاعلية"],
  },
];

const arabicMonths = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

function formatEventDate(event: AwarenessEvent) {
  return `${event.day} ${arabicMonths[event.month - 1]}`;
}

// Shared events cache: Supabase is the source of truth for awareness events.
let eventCache: AwarenessEvent[] = awarenessEvents;
let eventsLoaded = false;
let eventsLoading: Promise<void> | null = null;
const eventSubscribers = new Set<(items: AwarenessEvent[]) => void>();
function publishEvents(items: AwarenessEvent[]) {
  eventCache = items;
  eventSubscribers.forEach((notify) => notify(items));
}
async function refreshEvents(force = false) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  if (eventsLoading) return eventsLoading;
  if (eventsLoaded && !force) return;
  eventsLoading = (async () => {
    const { data, error } = await supabase.from("awareness_events").select("data");
    if (error) throw error;
    publishEvents((data ?? []).map((row) => row.data as AwarenessEvent));
    eventsLoaded = true;
  })();
  try { await eventsLoading; } finally { eventsLoading = null; }
}
function useManagedEvents() {
  const [items, setItems] = useState<AwarenessEvent[]>(eventCache);
  useEffect(() => {
    eventSubscribers.add(setItems);
    void refreshEvents().catch((error) => console.error("تعذر تحميل المناسبات:", error));
    const { data: authListener } = supabase?.auth.onAuthStateChange(() => {
      void refreshEvents(true).catch((error) => console.error("تعذر تحديث المناسبات:", error));
    }) ?? { data: null };
    return () => { eventSubscribers.delete(setItems); authListener?.subscription.unsubscribe(); };
  }, []);
  return [items, setItems] as const;
}
async function saveEventToSupabase(event: AwarenessEvent) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  const { error } = await supabase.from("awareness_events").upsert({ id: event.id, data: event }, { onConflict: "id" });
  if (error) throw error;
  await refreshEvents(true);
}
async function deleteEventFromSupabase(id: string) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  const { data, error } = await supabase.from("awareness_events").delete().eq("id", id).select("id");
  if (error) throw error;
  if (!data?.length) throw new Error("لم يتم حذف المناسبة؛ تحقق من صلاحيات الحساب");
  await refreshEvents(true);
}

function readStoredData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function useStoredData<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStoredData(key, fallback));
  const update = (next: T | ((current: T) => T)) => {
    setValue((current) => {
      const resolved = typeof next === "function"
        ? (next as (current: T) => T)(current)
        : next;
      window.localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  };
  return [value, update] as const;
}

type PlatformSettings = {
  name: string;
  description: string;
  contact: string;
  homeActivities: boolean;
  homeKnowledge: boolean;
  homeEvents: boolean;
  notifications: boolean;
  impactSessions: number;
  impactBeneficiaries: number;
  impactResources: number;
  impactCourses: number;
  chartMonthly: number[];
  chartFamilies: number;
  chartChildren: number;
  chartFieldTeams: number;
  goalTarget: number | null;
  goalAchieved: number | null;
};

const defaultPlatformSettings: PlatformSettings = {
  name: "منصة المياه والصرف الصحي وتعزيز النظافة",
  description: "منصة للمعرفة والأنشطة والتدريب المجتمعي.",
  contact: "info@parc.ps",
  homeActivities: true,
  homeKnowledge: true,
  homeEvents: true,
  notifications: true,
  impactSessions: 0,
  impactBeneficiaries: 0,
  impactResources: 0,
  impactCourses: 0,
  chartMonthly: [0, 0, 0, 0, 0, 0],
  chartFamilies: 0,
  chartChildren: 0,
  chartFieldTeams: 0,
  goalTarget: null,
  goalAchieved: null,
};

let platformSettingsCache: PlatformSettings = defaultPlatformSettings;
let platformSettingsLoaded = false;
let platformSettingsLoading: Promise<void> | null = null;
const platformSettingsSubscribers = new Set<(settings: PlatformSettings) => void>();

function publishPlatformSettings(settings: PlatformSettings) {
  platformSettingsCache = settings;
  platformSettingsSubscribers.forEach((notify) => notify(settings));
}

async function refreshPlatformSettings(force = false) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  if (platformSettingsLoading) return platformSettingsLoading;
  if (platformSettingsLoaded && !force) return;
  platformSettingsLoading = (async () => {
    const { data, error } = await supabase
      .from("platform_settings")
      .select("data")
      .eq("id", "homepage")
      .maybeSingle();
    if (error) throw error;
    publishPlatformSettings({ ...defaultPlatformSettings, ...(data?.data ?? {}) });
    platformSettingsLoaded = true;
  })();
  try { await platformSettingsLoading; } finally { platformSettingsLoading = null; }
}

function usePlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings>(platformSettingsCache);
  useEffect(() => {
    platformSettingsSubscribers.add(setSettings);
    void refreshPlatformSettings().catch((error) => console.error("تعذر تحميل إعدادات المنصة:", error));
    return () => { platformSettingsSubscribers.delete(setSettings); };
  }, []);
  return settings;
}

async function savePlatformSettings(settings: PlatformSettings) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  const { data, error } = await supabase
    .from("platform_settings")
    .update({ data: settings, updated_at: new Date().toISOString() })
    .eq("id", "homepage")
    .select("id");
  if (error) throw error;
  if (!data?.length) throw new Error("لم يتم حفظ الإعدادات؛ تحقق من صلاحيات المدير");
  await refreshPlatformSettings(true);
}

function queueAdminToast(message: string) {
  window.sessionStorage.setItem("admin-toast", message);
  window.dispatchEvent(new CustomEvent("admin-toast", { detail: message }));
}

function getUpcomingEvents(now = new Date(), events: AwarenessEvent[] = eventCache) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return events
    .filter((event) => event.showOnHomepage !== false)
    .map((event) => {
      let date = new Date(now.getFullYear(), event.month - 1, event.day);
      if (date < start) date = new Date(now.getFullYear() + 1, event.month - 1, event.day);
      return { event, date };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function UpcomingOccasions() {
  const now = new Date();
  const [managedEvents] = useManagedEvents();
  const upcoming = getUpcomingEvents(now, managedEvents).slice(0, 3);
  const today = managedEvents.find(
    (event) => event.day === now.getDate() && event.month === now.getMonth() + 1,
  );

  return (
    <section className="upcoming-section container" aria-labelledby="upcoming-title">
      {today && (
        <a className="today-event" href={`#/event/${today.id}`}>
          <span className="today-event-icon"><Icon name={today.icon} size={20} /></span>
          <div>
            <small>مناسبة اليوم</small>
            <strong>اليوم هو {today.name}</strong>
          </div>
          <span className="today-action">اعرف المزيد</span>
        </a>
      )}
      <div className="upcoming-card">
        <div className="upcoming-heading">
          <div>
            <div className="eyebrow">مواسم التوعية</div>
            <h2 id="upcoming-title">المناسبات القادمة</h2>
          </div>
          <p>أقرب الأيام العالمية المرتبطة بالصحة والنظافة والبيئة.</p>
        </div>
        <div className="upcoming-list">
          {upcoming.map(({ event }) => (
            <a href={`#/event/${event.id}`} key={event.id}>
              <span className={`occasion-icon occasion-${event.icon}`}>
                <Icon name={event.icon} size={22} />
              </span>
              <div>
                <h3>{event.name}</h3>
                <span>{event.category}</span>
              </div>
              <time>{formatEventDate(event)}</time>
              <Icon name="arrow" size={18} />
            </a>
          ))}
        </div>
        <a className="calendar-link" href="#/campaigns">
          عرض التقويم
          <Icon name="arrow" size={17} />
        </a>
      </div>
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
}) {
  return (
    <div className="section-heading">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function ImpactCounter({
  value,
  label,
  icon,
}: {
  value: number;
  label: string;
  icon: IconName;
}) {
  const counterRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setCount(value);
      return;
    }

    let animationFrame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const startedAt = performance.now();
        const duration = 1300;

        const update = (timestamp: number) => {
          const progress = Math.min((timestamp - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(value * eased));
          if (progress < 1) animationFrame = requestAnimationFrame(update);
        };

        animationFrame = requestAnimationFrame(update);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  return (
    <div ref={counterRef}>
      <span className="landing-impact-icon"><Icon name={icon} size={29} /></span>
      <span className="landing-impact-copy">
        <strong dir="ltr">{new Intl.NumberFormat("en-US").format(count)}+</strong>
        <span>{label}</span>
      </span>
    </div>
  );
}

const awarenessAreas: Array<{
  icon: IconName;
  title: string;
  description: string;
  number: string;
}> = [
  {
    icon: "hand",
    title: "النظافة الشخصية والأسرية",
    description: "ممارسات يومية لحياة أكثر صحة.",
    number: "١",
  },
  {
    icon: "drop",
    title: "المياه والصرف الصحي",
    description: "الاستخدام الآمن للمياه وتحسين ممارسات النظافة.",
    number: "٢",
  },
  {
    icon: "shield",
    title: "مكافحة القوارض والآفات",
    description: "الوقاية والتعرف على المخاطر وطرق المكافحة الآمنة.",
    number: "٣",
  },
  {
    icon: "trash",
    title: "إدارة النفايات",
    description: "ممارسات صحيحة للتخلص من النفايات والحفاظ على البيئة.",
    number: "٤",
  },
];

const activities = [
  {
    title: "أساسيات مكافحة القوارض",
    category: "تدريب",
    description: "التعرف على القوارض وعلامات انتشارها وطرق الوقاية منها.",
    image: photos.inspection,
    alt: "زيارة ميدانية لمعاينة النفايات ومخاطر الصحة البيئية في غزة",
  },
  {
    title: "حملة بيئة نظيفة",
    category: "نشاط مجتمعي",
    description: "نشاط عملي للحد من مصادر التلوث ومسببات انتشار الآفات.",
    image: photos.cleanup,
    alt: "أطفال يشاركون في نشاط للنظافة وإدارة النفايات في مجتمع نازح",
  },
  {
    title: "غسل اليدين بطريقة صحيحة",
    category: "جلسة توعوية",
    description: "خطوات بسيطة وفعالة للوقاية من الأمراض.",
    image: photos.handwashing,
    alt: "أطفال يشاركون في نشاط عملي للمياه والنظافة في بيئة إنسانية",
  },
];

const resources: Array<{
  title: string;
  type: string;
  icon: IconName;
  image: string;
}> = [
  {
    title: "دليل مكافحة القوارض والآفات",
    type: "دليل إرشادي",
    icon: "book",
    image: photos.inspection,
  },
  {
    title: "ملصق الوقاية من القوارض",
    type: "ملصق توعوي",
    icon: "poster",
    image: photos.cleanupClose,
  },
  {
    title: "النظافة البيئية في المنزل",
    type: "فيديو توعوي",
    icon: "play",
    image: photos.handwashing,
  },
];

function HomePage() {
  const [managedActivities] = useManagedActivities();
  const [managedResources] = useManagedResources();
  const now = new Date();
  const [managedEvents] = useManagedEvents();
  const homeSettings = usePlatformSettings();
  const upcoming = getUpcomingEvents(now, managedEvents).slice(0, 3).map(({ event }) => event);
  const today = managedEvents.find(
    (event) => event.day === now.getDate() && event.month === now.getMonth() + 1,
  );

  const landingAreas = [
    {
      title: "النظافة الشخصية والأسرية",
      description: "ممارسات يومية بسيطة تحمي صحة الأسرة.",
      icon: "hand" as IconName,
      image: photos.handwashing,
    },
    {
      title: "المياه والصرف الصحي",
      description: "مياه آمنة وبيئة نظيفة لمجتمع أكثر صحة.",
      icon: "drop" as IconName,
      image: photos.cleanWater,
    },
    {
      title: "مكافحة القوارض والآفات",
      description: "وقاية واعية تبدأ من بيئة نظيفة وآمنة.",
      icon: "shield" as IconName,
      image: photos.inspection,
    },
  ];

  // Homepage cards are sourced from Supabase, never from hardcoded demo content.
  const landingActivities = managedActivities
    .filter((activity) => activity.status === "منشور")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  // Show only published Supabase library materials on the homepage.
  const landingResources = managedResources
    .filter((resource) => resource.status === "منشور")
    .slice(0, 3);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = document.querySelectorAll<HTMLElement>(
      ".landing-page .landing-reveal, .landing-page .landing-stagger",
    );

    if (reducedMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    revealElements.forEach((element) => observer.observe(element));

    const heroImage = document.querySelector<HTMLElement>(".landing-hero-photo > img");
    let animationFrame = 0;
    const updateParallax = () => {
      animationFrame = 0;
      if (!heroImage) return;
      const hero = heroImage.parentElement?.getBoundingClientRect();
      if (!hero || hero.bottom < 0 || hero.top > window.innerHeight) return;
      const offset = Math.max(-10, Math.min(10, hero.top * -0.018));
      heroImage.style.setProperty("--hero-parallax-y", `${offset}px`);
    };
    const onScroll = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(updateParallax);
    };
    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="site-shell landing-page">
      <PublicHeader ctaLabel="استكشف المنصة" />

      <main>
        <section className="landing-hero container" id="home">
          <div className="landing-hero-main">
            <div className="landing-hero-copy">
              <div className="eyebrow">صحة أفضل تبدأ بالوعي</div>
              <h1>
                معًا نحو <span>بيئة أكثر</span>
                <br />
                <span className="hero-gold">صحة وأمانًا</span>
              </h1>
              <p>
                نعمل مع المجتمعات في غزة لتعزيز ممارسات النظافة والوقاية وبناء
                بيئة أكثر صحة وأمانًا للجميع.
              </p>
              <div className="landing-hero-actions">
                <a className="button button-orange" href="#/activities">
                  استكشف الأنشطة
                  <Icon name="arrow" size={18} />
                </a>
                <a className="landing-text-link" href="#landing-areas">
                  اعرف المزيد
                  <Icon name="arrow" size={17} />
                </a>
              </div>
            </div>

            <div className="landing-hero-photo">
              <img
                alt="عامل إغاثة يساعد أطفالًا على غسل أيديهم قرب خزان مياه وخيام نزوح في غزة"
                src={gazaHygieneHero}
              />
              {homeSettings.homeEvents && <div className="landing-events">
                <span className="landing-events-label">المناسبات القادمة</span>
                {upcoming.map((event, index) => {
                  const highlighted = Boolean(today && event.id === today.id && index === 0);
                  return (
                    <a
                      className={highlighted ? "is-today" : ""}
                      href={`#/event/${event.id}`}
                      key={event.id}
                    >
                      <span className="landing-event-icon">
                        <Icon name={event.icon} size={18} />
                      </span>
                      <span>
                        {highlighted && <small>اليوم هو</small>}
                        <strong>{event.name}</strong>
                        <time>{formatEventDate(event)}</time>
                      </span>
                      <Icon name="arrow" size={16} />
                    </a>
                  );
                })}
                <a className="landing-calendar-link" href="#/campaigns">
                  عرض التقويم
                  <Icon name="arrow" size={15} />
                </a>
              </div>}
            </div>
          </div>

          <div className="landing-hero-wave" aria-hidden="true">
            <svg preserveAspectRatio="none" viewBox="0 0 1440 210">
              <path
                className="landing-wave-back"
                d="M0 52C230 93 432 82 654 112C912 147 1170 165 1440 92V210H0Z"
              />
              <path
                className="landing-wave-front"
                d="M0 76C222 120 445 90 688 125C934 160 1188 174 1440 116V210H0Z"
              />
              <path
                className="landing-wave-olive-accent"
                d="M0 128C72 92 150 98 218 135C145 148 79 165 0 184ZM1160 174C1240 146 1342 145 1440 158V210H1194C1184 196 1172 185 1160 174Z"
              />
            </svg>
            <span className="landing-wave-botanical">
              <i></i><i></i><i></i><i></i>
            </span>
          </div>

          <div className="landing-impact" aria-label="أثر المنصة">
            {[
              [homeSettings.impactSessions, "جلسة توعوية", "community"],
              [homeSettings.impactBeneficiaries, "مستفيد", "users"],
              [homeSettings.impactResources, "مادة توعوية", "book"],
              [homeSettings.impactCourses, "دورة تدريبية", "cap"],
            ].map(([value, label, icon]) => (
              <ImpactCounter
                icon={icon as IconName}
                key={label}
                label={String(label)}
                value={Number(value)}
              />
            ))}
          </div>
        </section>

        <section className="landing-areas landing-reveal container" id="landing-areas">
          <div className="landing-areas-intro">
            <div className="eyebrow">مجالاتنا</div>
            <h2>
              مجالات توعوية
              <br />
              لمجتمع أكثر صحة
            </h2>
            <p>
              محتوى وأنشطة عملية تساعد الأفراد والأسر والمجتمعات على تبني
              ممارسات صحية وآمنة.
            </p>
            <a className="button button-outline" href="#/library">
              استكشف المجالات
            </a>
          </div>
          <div className="landing-area-grid landing-stagger">
            {landingAreas.map((area) => (
              <a className="landing-area-card" href="#/library" key={area.title}>
                <img alt={area.title} src={area.image} />
                <div>
                  <span><Icon name={area.icon} size={20} /></span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {homeSettings.homeActivities && <section className="landing-section landing-activities landing-reveal">
          <div className="container">
            <div className="landing-section-heading">
              <div>
                <div className="eyebrow">تعلم بالمشاركة</div>
                <h2>أنشطة تصنع فرقًا</h2>
              </div>
              <a className="landing-text-link" href="#/activities">
                عرض جميع الأنشطة
                <Icon name="arrow" size={17} />
              </a>
            </div>
            <div className="landing-activity-grid landing-stagger">
              {landingActivities.length === 0 && <p>لا توجد أنشطة منشورة حاليًا.</p>}
              {landingActivities.map((activity) => (
                <a
                  className="landing-activity-card"
                  href={`#/activity/${activity.id}`}
                  key={activity.id}
                >
                  <img alt={activity.title} src={activity.image} />
                  <div>
                    <span>{activity.category}</span>
                    <h3>{activity.title}</h3>
                  </div>
                  <span className="landing-card-arrow">
                    <Icon name="arrow" size={18} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>}

        <section className="landing-feature landing-reveal container">
          <div className="landing-feature-image">
            <img alt="بيئة مخيم وممرات بين الخيام ضمن أعمال الوقاية والصحة البيئية" src={photos.storage} />
          </div>
          <div className="landing-feature-copy">
            <div className="eyebrow eyebrow-light">الوقاية قبل المكافحة</div>
            <h2>الوقاية تبدأ من بيئة نظيفة</h2>
            <p>
              تعرّف على علامات وجود القوارض، مسببات انتشارها، وأساليب الوقاية
              والمكافحة الآمنة.
            </p>
            <div className="landing-feature-points">
              {[
                ["search", "رصد العلامات"],
                ["trash", "إدارة النفايات"],
                ["shield", "وقاية آمنة"],
              ].map(([icon, label]) => (
                <span key={label}>
                  <Icon name={icon as IconName} size={18} />
                  {label}
                </span>
              ))}
            </div>
            <a className="button button-orange" href="#/activity/rodent-signs">
              استكشف مكافحة القوارض والآفات
            </a>
          </div>
        </section>

        {homeSettings.homeKnowledge && <section className="landing-section landing-library landing-reveal">
          <div className="container">
            <div className="landing-section-heading">
              <div>
                <div className="eyebrow">معرفة جاهزة للاستخدام</div>
                <h2>المكتبة التوعوية</h2>
              </div>
              <a className="button button-outline" href="#/library">
                استكشف المكتبة
              </a>
            </div>
            <div className="landing-resource-grid landing-stagger">
              {landingResources.length === 0 && <p>لا توجد مواد توعوية منشورة حاليًا.</p>}
              {landingResources.map((resource) => {
                const resourceIcon: IconName = resource.type === "فيديو" ? "play" :
                  ["ملصق", "صورة"].includes(resource.type) ? "poster" : "book";
                return (
                  <a
                    className="landing-resource-card"
                    href={`#/resource/${resource.id}`}
                    key={resource.id}
                  >
                    <img alt={resource.title} src={resource.image || photos.inspection} />
                    <div>
                      <span><Icon name={resourceIcon} size={18} />{resource.type}</span>
                      <h3>{resource.title}</h3>
                    </div>
                    <Icon name="arrow" size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </section>}

        <section className="landing-cta landing-reveal container">
          <div>
            <span>ابدأ من مجتمعك</span>
            <h2>خطوات بسيطة تصنع فرقًا كبيرًا</h2>
          </div>
          <a className="button button-orange" href="#/activities">
            ابدأ الآن
            <Icon name="arrow" size={18} />
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function PageIntro({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-intro">
      <div>
        <div className="eyebrow">منصة المياه والصرف الصحي وتعزيز النظافة</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function PublicPage({
  active,
  children,
}: {
  active?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="site-shell inner-site">
      <PublicHeader active={active} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

function SearchField({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="search-field">
      <Icon name="search" size={20} />
      <input
        aria-label={placeholder}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  );
}

function ChipFilters({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
}) {
  return (
    <div className="filter-chips" aria-label="التصنيفات">
      {items.map((item) => (
        <button
          className={selected === item ? "selected" : ""}
          key={item}
          onClick={() => onSelect(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

type ManagedActivity = {
  id: string;
  title: string;
  category: string;
  audience: string;
  duration: string;
  description: string;
  fullDescription: string;
  image: string;
  objectives: string;
  materials: string;
  steps: string;
  messages: string;
  status: "مسودة" | "منشور";
  createdAt: string;
};

const fullActivities: ManagedActivity[] = [
  {
    id: "handwashing-challenge",
    title: "تحدي غسل اليدين",
    category: "النظافة الشخصية",
    audience: "الأطفال",
    duration: "٣٠ دقيقة",
    description: "نشاط تفاعلي يعلّم الأطفال خطوات غسل اليدين بطريقة ممتعة.",
    fullDescription: "جلسة عملية تفاعلية تشرح خطوات غسل اليدين والأوقات الحرجة.",
    image: photos.handwashing,
    objectives: "تعزيز ممارسة غسل اليدين الصحيحة",
    materials: "ماء، صابون، ملصق الخطوات",
    steps: "شرح، عرض عملي، تطبيق المشاركين، مراجعة",
    messages: "اغسل يديك بالماء والصابون في الأوقات الحرجة",
    status: "منشور",
    createdAt: "2025-10-15",
  },
  {
    id: "rodent-signs",
    title: "اكتشف علامات وجود القوارض",
    category: "القوارض والآفات",
    audience: "الأسر والمجتمع",
    duration: "٤٥ دقيقة",
    description: "جولة تعليمية للتعرف على العلامات المبكرة وطرق الوقاية الآمنة.",
    fullDescription: "نشاط ميداني يساعد الفرق والأسر على رصد العلامات وتقليل مصادر الجذب.",
    image: photos.inspection,
    objectives: "الاكتشاف المبكر وتقليل مخاطر القوارض",
    materials: "قائمة فحص، قلم، صور تعليمية",
    steps: "مراجعة العلامات، جولة ملاحظة، تسجيل النتائج، خطة وقاية",
    messages: "الوقاية والنظافة البيئية تقللان مخاطر الآفات",
    status: "منشور",
    createdAt: "2025-10-21",
  },
  {
    id: "clean-environment",
    title: "بيئتنا نظيفة",
    category: "إدارة النفايات",
    audience: "المجتمع",
    duration: "٦٠ دقيقة",
    description: "مبادرة جماعية لتنظيف المساحات العامة والحد من مصادر التلوث.",
    fullDescription: "نشاط مجتمعي منظم لتنظيف المساحات المشتركة وتحسين إدارة النفايات.",
    image: photos.cleanup,
    objectives: "تحسين النظافة البيئية وتقليل مصادر التلوث",
    materials: "قفازات، أكياس نفايات، أدوات تنظيف",
    steps: "تحديد الموقع، توزيع المهام، التنظيف، فرز النفايات",
    messages: "بيئتنا النظيفة مسؤولية مشتركة",
    status: "منشور",
    createdAt: "2025-11-03",
  },
  {
    id: "safe-food-storage",
    title: "التخزين الآمن للطعام",
    category: "المياه والصرف الصحي",
    audience: "الأسر",
    duration: "٣٠ دقيقة",
    description: "ممارسات عملية لحفظ الطعام بعيدًا عن التلوث والآفات.",
    fullDescription: "تدريب أسري قصير على حماية الطعام من التلوث ومصادر جذب الآفات.",
    image: photos.cleanupClose,
    objectives: "تعزيز التخزين الآمن للطعام",
    materials: "أوعية محكمة، بطاقات توضيحية",
    steps: "فحص مكان التخزين، عرض الأوعية، تطبيق عملي",
    messages: "احفظ الطعام مغطى وبعيدًا عن مصادر التلوث",
    status: "منشور",
    createdAt: "2025-11-10",
  },
];

// Shared activity cache: Supabase is the source of truth for activities.
let activityCache: ManagedActivity[] = fullActivities;
let activityLoaded = false;
let activityLoading: Promise<void> | null = null;
const activitySubscribers = new Set<(items: ManagedActivity[]) => void>();
function publishActivities(items: ManagedActivity[]) {
  activityCache = items;
  activitySubscribers.forEach((notify) => notify(items));
}
async function refreshActivities(force = false) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  if (activityLoading) return activityLoading;
  if (activityLoaded && !force) return;
  activityLoading = (async () => {
    const { data, error } = await supabase.from("managed_activities").select("data");
    if (error) throw error;
    publishActivities((data ?? []).map((row) => row.data as ManagedActivity));
    activityLoaded = true;
  })();
  try { await activityLoading; } finally { activityLoading = null; }
}
function useManagedActivities() {
  const [items, setItems] = useState<ManagedActivity[]>(activityCache);
  useEffect(() => {
    activitySubscribers.add(setItems);
    void refreshActivities().catch((error) => console.error("تعذر تحميل الأنشطة:", error));
    const { data: authListener } = supabase?.auth.onAuthStateChange(() => {
      // Re-read on login/logout so draft visibility follows RLS.
      void refreshActivities(true).catch((error) => console.error("تعذر تحديث الأنشطة:", error));
    }) ?? { data: null };
    return () => { activitySubscribers.delete(setItems); authListener?.subscription.unsubscribe(); };
  }, []);
  return [items, setItems] as const;
}
async function saveActivityToSupabase(activity: ManagedActivity) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  const { error } = await supabase.from("managed_activities").upsert({ id: activity.id, data: activity }, { onConflict: "id" });
  if (error) throw error;
  await refreshActivities(true);
}
async function deleteActivityFromSupabase(id: string) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  const { error } = await supabase.from("managed_activities").delete().eq("id", id).select("id");
  if (error) throw error;
  await refreshActivities(true);
}

type ActivityListItem = Pick<
  ManagedActivity,
  "id" | "title" | "category" | "audience" | "duration" | "description" | "image"
> & {
  objective: string;
  materials: string[];
  steps: string[];
  messages: string[];
};

const activitiesPageItems: ActivityListItem[] = [
  {
    id: "water-tanks",
    title: "خزانات المياه وصيانتها",
    category: "المياه",
    audience: "الأسر والمجتمع",
    duration: "٤٥ دقيقة",
    description: "إرشادات عملية لتنظيف خزانات المياه وفحصها وصيانتها بصورة دورية.",
    image: photos.storage,
    objective: "الحفاظ على جودة المياه المخزنة والحد من مخاطر التلوث.",
    materials: ["قفازات واقية", "فرشاة تنظيف", "محلول تعقيم آمن", "قائمة فحص الخزان"],
    steps: ["افحص الخزان وحدد أي تشققات أو تسربات.", "أفرغ الخزان ونظّف الجدران الداخلية.", "عقّم الخزان بالمحلول الآمن.", "أعد تعبئة الخزان وسجّل موعد الصيانة القادمة."],
    messages: ["نظّف الخزان بصورة دورية.", "أبقِ غطاء الخزان محكمًا.", "لا تستخدم مواد تنظيف غير مخصصة لمياه الشرب."],
  },
  {
    id: "water-wells",
    title: "آبار المياه",
    category: "المياه",
    audience: "الأسر والمجتمع",
    duration: "٤٥ دقيقة",
    description: "التعريف بأساليب حماية آبار المياه والحفاظ على سلامة مصادرها.",
    image: photos.cleanWater,
    objective: "تعزيز حماية آبار المياه من مصادر التلوث المحيطة.",
    materials: ["قائمة فحص", "صور تعليمية", "قفازات واقية", "سجل متابعة"],
    steps: ["عرّف المشاركين بمصادر تلوث الآبار.", "افحص محيط البئر بصريًا.", "سجّل مصادر الخطر المحتملة.", "ضع إجراءات حماية ومتابعة دورية."],
    messages: ["حماية محيط البئر تحمي مصدر المياه.", "أبلغ عن أي تغير في لون المياه أو رائحتها.", "امنع تراكم النفايات قرب الآبار."],
  },
  {
    id: "desalination-plants",
    title: "محطات تحلية المياه",
    category: "المياه",
    audience: "المجتمع",
    duration: "٦٠ دقيقة",
    description: "التوعية بدور محطات التحلية وممارسات الحصول على مياه شرب آمنة.",
    image: photos.cleanWater,
    objective: "رفع الوعي بمراحل التحلية ومؤشرات سلامة مياه الشرب.",
    materials: ["مخطط مراحل التحلية", "عبوات عينات", "بطاقات توعوية", "قائمة تحقق"],
    steps: ["اشرح مراحل معالجة المياه وتحليتها.", "وضّح مؤشرات جودة المياه.", "راجع أساليب تعبئة المياه ونقلها.", "ناقش إجراءات الإبلاغ عن أي مشكلة."],
    messages: ["احصل على المياه من محطة موثوقة.", "استخدم عبوات نظيفة ومغلقة.", "لا تشرب المياه عند تغير طعمها أو رائحتها."],
  },
  {
    id: "drinking-water-distribution",
    title: "توزيع مياه الشرب",
    category: "المياه",
    audience: "الأسر والمجتمع",
    duration: "٤٥ دقيقة",
    description: "ممارسات آمنة لنقل مياه الشرب وتوزيعها وتخزينها دون تلوث.",
    image: photos.storage,
    objective: "ضمان وصول مياه الشرب إلى الأسر بطريقة آمنة ومنظمة.",
    materials: ["عبوات مياه نظيفة", "أغطية محكمة", "سجل توزيع", "ملصقات إرشادية"],
    steps: ["تحقق من نظافة مصدر المياه والعبوات.", "نظّم نقاط وأدوار التوزيع.", "أغلق العبوات بعد تعبئتها مباشرة.", "سجّل الكميات الموزعة ووجه الأسر للتخزين الآمن."],
    messages: ["استخدم عبوات مخصصة لمياه الشرب.", "لا تلمس فوهة العبوة أثناء التعبئة.", "احفظ المياه مغطاة وفي مكان نظيف."],
  },
  {
    id: "toilets-maintenance",
    title: "الحمامات وصيانتها",
    category: "الصرف الصحي",
    audience: "الأسر والمجتمع",
    duration: "٤٥ دقيقة",
    description: "خطوات الحفاظ على نظافة الحمامات وصيانتها والحد من المخاطر الصحية.",
    image: photos.cleanupClose,
    objective: "تحسين نظافة الحمامات وسلامتها من خلال الصيانة المنتظمة.",
    materials: ["قفازات", "مواد تنظيف وتعقيم", "فرشاة تنظيف", "قائمة صيانة"],
    steps: ["افحص الحمام وحدد الأعطال.", "نظّف الأسطح والمرافق وعقّمها.", "تحقق من تدفق المياه والتصريف.", "سجّل الأعطال التي تحتاج إلى صيانة."],
    messages: ["نظافة الحمام تحمي صحة الأسرة.", "أصلح التسربات فور اكتشافها.", "اغسل يديك بعد استخدام الحمام."],
  },
  {
    id: "sanitation-water-networks",
    title: "صيانة شبكات الصرف الصحي والمياه",
    category: "الصرف الصحي",
    audience: "الفرق الميدانية",
    duration: "٦٠ دقيقة",
    description: "التوعية بأهمية متابعة شبكات المياه والصرف الصحي والإبلاغ عن الأعطال.",
    image: photos.cleanup,
    objective: "دعم الرصد المبكر لأعطال الشبكات وتقليل مخاطر التسرب والتلوث.",
    materials: ["خريطة الموقع", "قائمة فحص", "معدات حماية شخصية", "نموذج بلاغ"],
    steps: ["راجع مسار الشبكة ومواقع النقاط الحساسة.", "افحص علامات التسرب أو الانسداد.", "حدّد المنطقة المتضررة وأمّن محيطها.", "وثّق العطل وأرسله إلى فريق الصيانة."],
    messages: ["لا تقترب من مياه الصرف المتسربة.", "أبلغ عن الأعطال فورًا.", "استخدم معدات الحماية أثناء الفحص."],
  },
  {
    id: "health-education",
    title: "التثقيف الصحي",
    category: "تعزيز النظافة",
    audience: "الأسر والأطفال",
    duration: "٣٠ دقيقة",
    description: "جلسات توعوية تعزز الممارسات الصحية والنظافة الشخصية في الحياة اليومية.",
    image: photos.handwashing,
    objective: "تعزيز السلوكيات اليومية التي تحمي صحة الأفراد والأسر.",
    materials: ["ملصقات توعوية", "بطاقات نقاش", "ماء وصابون", "صور تعليمية"],
    steps: ["ابدأ بنقاش حول الممارسات اليومية.", "اعرض السلوك الصحي الصحيح عمليًا.", "دع المشاركين يطبقون الخطوات.", "راجع الرسائل الأساسية وأجب عن الأسئلة."],
    messages: ["اغسل يديك بالماء والصابون.", "حافظ على نظافة الطعام والمياه.", "شارك المعلومة الصحية مع أسرتك."],
  },
  {
    id: "rodent-control",
    title: "مكافحة القوارض",
    category: "تعزيز النظافة",
    audience: "الأسر والمجتمع",
    duration: "٤٥ دقيقة",
    description: "التعرف على علامات وجود القوارض وطرق الوقاية والمكافحة الآمنة.",
    image: photos.inspection,
    objective: "الاكتشاف المبكر للقوارض وتقليل مصادر الجذب والمخاطر الصحية.",
    materials: ["قائمة فحص القوارض", "صور تعليمية", "قفازات", "قلم لتسجيل الملاحظات"],
    steps: ["قدّم العلامات الشائعة بصور تعليمية واضحة.", "نفّذ جولة ملاحظة حول مصادر الطعام والمداخل.", "سجّل الملاحظات في قائمة الفحص.", "اتفق مع المشاركين على ثلاث خطوات وقائية."],
    messages: ["احفظ الطعام في أوعية محكمة الإغلاق.", "أغلق الشقوق والفتحات الصغيرة.", "تخلّص من النفايات يوميًا بطريقة آمنة.", "اطلب دعم المختصين عند زيادة العلامات."],
  },
];

function ActivityFullCard({ item }: { item: ActivityListItem }) {
  return (
    <article className="listing-card">
      <div className="listing-image">
        <img src={item.image} alt={item.title} />
        <span className="category-tag">{item.category}</span>
      </div>
      <div className="listing-body">
        <h3>{item.title}</h3>
        <div className="mini-meta">
          <span>الفئة: {item.audience}</span>
          <span>المدة: {item.duration}</span>
        </div>
        <p>{item.description}</p>
        <a className="button button-outline" href={`#/activity/${item.id}`}>
          عرض النشاط
        </a>
      </div>
    </article>
  );
}

function ActivitiesPage() {
  const [managedActivities] = useManagedActivities();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("الكل");
  const visible = useMemo(
    () =>
      [...activitiesPageItems, ...managedActivities.filter((item) => item.status === "منشور" && !activitiesPageItems.some((original) => original.id === item.id)).map((item) => ({
        ...item,
        objective: "objective" in item ? item.objective : item.objectives,
        materials: Array.isArray(item.materials) ? item.materials : item.materials.split("\n"),
        steps: Array.isArray(item.steps) ? item.steps : item.steps.split("\n"),
        messages: Array.isArray(item.messages) ? item.messages : item.messages.split("\n"),
      }))].filter(
        (item) =>
          (filter === "الكل" || item.category === filter) &&
          matchesLocalizedText(item.title, query),
      ),
    [filter, query, managedActivities],
  );

  return (
    <PublicPage active="activities">
      <section className="inner-page activities-page container">
        <PageIntro
          title="الأنشطة"
          subtitle="اكتشف الأنشطة التوعوية والعملية المناسبة لمجتمعك."
        />
        <div className="discovery-bar">
          <SearchField
            placeholder="ابحث عن نشاط..."
            value={query}
            onChange={setQuery}
          />
          <ChipFilters
            items={[
              "الكل",
              "المياه",
              "الصرف الصحي",
              "تعزيز النظافة",
            ]}
            selected={filter}
            onSelect={setFilter}
          />
        </div>
        <div className="listing-grid">
          {visible.map((item) => (
<ActivityFullCard
  key={item.title}
  item={{
    ...item,
    objective: typeof item.objective === "string" ? item.objective : "",
    materials: Array.isArray(item.materials)
      ? item.materials
      : String(item.materials ?? "").split("\n"),
    steps: Array.isArray(item.steps)
      ? item.steps
      : String(item.steps ?? "").split("\n"),
    messages: Array.isArray(item.messages)
      ? item.messages
      : String(item.messages ?? "").split("\n"),
  }}
/>          ))}
        </div>
      </section>
    </PublicPage>
  );
}

const activityTabs = [
  "نظرة عامة",
  "خطوات تنفيذ النشاط",
  "الرسائل الرئيسية",
  "التقييم",
  "المواد المطلوبة",
];

function ActivityDetailsPage({ activity }: { activity: ActivityListItem }) {
  const [tab, setTab] = useState("نظرة عامة");
  return (
    <PublicPage active="activities">
      <section className="detail-page container">
        <a className="back-link" href="#/activities">
          <Icon name="arrow" size={18} />
          العودة إلى الأنشطة
        </a>
        <div className="detail-hero">
          <div className="detail-cover">
            <img src={activity.image} alt={activity.title} />
          </div>
          <div className="detail-summary">
            <span className="soft-tag">{activity.category}</span>
            <h1>{activity.title}</h1>
            <p>{activity.description}</p>
            <div className="meta-grid">
              <MetaItem label="الفئة المستهدفة" value={activity.audience} />
              <MetaItem label="المدة" value={activity.duration} />
              <MetaItem label="النوع" value={activity.category} />
              <MetaItem label="الموقع" value="المجتمع المحلي" />
            </div>
            <a className="button button-orange" href="#activity-content">
              ابدأ النشاط
            </a>
          </div>
        </div>

        <div className="tab-shell" id="activity-content">
          <div className="tabs" role="tablist">
            {activityTabs.map((item) => (
              <button
                className={tab === item ? "active" : ""}
                key={item}
                onClick={() => setTab(item)}
                role="tab"
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {tab === "نظرة عامة" && (
              <div className="reading-block">
                <h2>عن النشاط</h2>
                <p>{activity.description}</p>
                <div className="message-cards">
                  <div><strong>الهدف</strong><span>{activity.objective}</span></div>
                  <div><strong>أسلوب التنفيذ</strong><span>{activity.steps[0]}</span></div>
                  <div><strong>النتيجة</strong><span>تطبيق الممارسات الصحيحة بصورة عملية.</span></div>
                </div>
              </div>
            )}
            {tab === "خطوات تنفيذ النشاط" && (
              <div className="steps-list">
                {activity.steps.map((step, index) => (
                  <div key={step}><span>{index + 1}</span><p>{step}</p></div>
                ))}
              </div>
            )}
            {tab === "الرسائل الرئيسية" && (
              <div className="check-list">
                {activity.messages.map((text) => <div key={text}><Icon name="check" />{text}</div>)}
              </div>
            )}
            {tab === "التقييم" && (
              <div className="check-list evaluation-list">
                {[
                  "تمكن المشاركون من شرح الهدف الرئيسي للنشاط.",
                  "حدد المشاركون الممارسات الصحيحة المرتبطة بالنشاط.",
                  "اختار المشاركون خطوات التطبيق المناسبة.",
                ].map((text) => <label key={text}><input type="checkbox" />{text}</label>)}
              </div>
            )}
            {tab === "المواد المطلوبة" && (
              <div className="download-list">
                {activity.materials.map(
                  (text) => (
                    <div key={text}>
                      <span className="file-mark">PDF</span>
                      <strong>{text}</strong>
                      <button type="button" onClick={() => window.alert("لا يوجد ملف مرفق لهذه الأداة حاليًا.")}>تحميل</button>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        <div className="related-section">
          <SectionHeading
            title="أنشطة مشابهة"
            subtitle="أنشطة قصيرة تكمل رحلة التعلم والتطبيق."
          />
          <div className="compact-card-grid">
            {activitiesPageItems.filter((item) => item.id !== activity.id).slice(0, 3).map((item) => (
              <ActivityFullCard item={item} key={item.title} />
            ))}
          </div>
        </div>
      </section>
    </PublicPage>
  );
}

type CourseModule = { id: string; title: string; lessons: Array<{ id: string; title: string }> };
type ManagedCourse = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  image: string;
  audience: string;
  learning: string;
  status: "مسودة" | "منشور";
  progress: number;
  modules: CourseModule[];
};

const courses: ManagedCourse[] = [
  {
    id: "rodent-basics",
    title: "أساسيات مكافحة القوارض",
    description: "دورة تمهيدية لفهم سلوك القوارض وممارسات الوقاية الآمنة.",
    category: "القوارض والآفات",
    duration: "ساعتان",
    level: "مبتدئ",
    progress: 65,
    image: photos.inspection,
    audience: "الفرق الميدانية والميسّرون",
    learning: "تمييز العلامات، تقييم المخاطر، تطبيق الوقاية",
    status: "منشور",
    modules: [{ id: "m1", title: "التعرف على القوارض", lessons: [{ id: "l1", title: "الأنواع والعلامات الشائعة" }] }],
  },
  {
    id: "rodent-prevention",
    title: "الوقاية من القوارض والآفات",
    description: "ممارسات بيئية ومجتمعية للحد من مصادر الجذب.",
    category: "القوارض والآفات",
    duration: "ساعة ونصف",
    level: "مبتدئ",
    progress: 0,
    image: photos.storage,
    audience: "الأسر والفرق المجتمعية",
    learning: "إدارة مصادر الجذب والرصد المبكر",
    status: "منشور",
    modules: [{ id: "m2", title: "الوقاية البيئية", lessons: [{ id: "l2", title: "الغذاء والمياه والنفايات" }] }],
  },
  {
    id: "hygiene-basics",
    title: "أساسيات تعزيز النظافة",
    description: "أساسيات تصميم رسائل وأنشطة تعزز الممارسات الصحية.",
    category: "النظافة",
    duration: "ساعتان",
    level: "مبتدئ",
    progress: 0,
    image: photos.handwashing,
    audience: "ميسّرو تعزيز النظافة",
    learning: "فهم السلوك، إعداد الرسائل، التيسير",
    status: "منشور",
    modules: [{ id: "m3", title: "مبادئ تعزيز النظافة", lessons: [{ id: "l3", title: "السلوك والمشاركة" }] }],
  },
  {
    id: "community-communication",
    title: "مهارات التواصل المجتمعي",
    description: "مهارات عملية للحوار والتيسير والاستماع المجتمعي.",
    category: "التواصل المجتمعي",
    duration: "ساعة ونصف",
    level: "متوسط",
    progress: 30,
    image: photos.training,
    audience: "العاملون الميدانيون",
    learning: "التيسير، الاستماع، إدارة الحوار",
    status: "منشور",
    modules: [{ id: "m4", title: "التواصل الفعال", lessons: [{ id: "l4", title: "مهارات الاستماع" }] }],
  },
];

// Shared course cache: Supabase is the source of truth for courses.
let courseCache: ManagedCourse[] = courses;
let courseLoaded = false;
let courseLoading: Promise<void> | null = null;
const courseSubscribers = new Set<(items: ManagedCourse[]) => void>();
function publishCourses(items: ManagedCourse[]) {
  courseCache = items;
  courseSubscribers.forEach((notify) => notify(items));
}
async function refreshCourses(force = false) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  if (courseLoading) return courseLoading;
  if (courseLoaded && !force) return;
  courseLoading = (async () => {
    const { data, error } = await supabase.from("managed_courses").select("data");
    if (error) throw error;
    publishCourses((data ?? []).map((row) => row.data as ManagedCourse));
    courseLoaded = true;
  })();
  try { await courseLoading; } finally { courseLoading = null; }
}
function useManagedCourses() {
  const [items, setItems] = useState<ManagedCourse[]>(courseCache);
  useEffect(() => {
    courseSubscribers.add(setItems);
    void refreshCourses().catch((error) => console.error("تعذر تحميل الدورات:", error));
    const { data: authListener } = supabase?.auth.onAuthStateChange(() => {
      void refreshCourses(true).catch((error) => console.error("تعذر تحديث الدورات:", error));
    }) ?? { data: null };
    return () => { courseSubscribers.delete(setItems); authListener?.subscription.unsubscribe(); };
  }, []);
  return [items, setItems] as const;
}
async function saveCourseToSupabase(course: ManagedCourse) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  const { error } = await supabase.from("managed_courses").upsert({ id: course.id, data: course }, { onConflict: "id" });
  if (error) throw error;
  await refreshCourses(true);
}
async function deleteCourseFromSupabase(id: string) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  const { data, error } = await supabase.from("managed_courses").delete().eq("id", id).select("id");
  if (error) throw error;
  if (!data?.length) throw new Error("لم يتم حذف الدورة؛ تحقق من صلاحيات الحساب");
  await refreshCourses(true);
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress-wrap">
      <div className="progress-label"><span>التقدم</span><strong>{value}٪</strong></div>
      <div className="progress-track"><span style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function CourseCard({ course }: { course: ManagedCourse }) {
  return (
    <article className="course-card">
      <div className="course-image"><img src={course.image} alt={course.title} /></div>
      <div className="course-body">
        <span className="soft-tag">{course.category}</span>
        <h3>{course.title}</h3>
        <div className="mini-meta">
          <span>المدة: {course.duration}</span>
          <span>المستوى: {course.level}</span>
        </div>
        {course.progress > 0 && <ProgressBar value={course.progress} />}
        <a className="button button-dark" href="#/course/rodent-basics">
          {course.progress > 0 ? "متابعة الدورة" : "ابدأ الدورة"}
        </a>
      </div>
    </article>
  );
}

function TrainingPage() {
  const [managedCourses] = useManagedCourses();
  const [filter, setFilter] = useState("الكل");
  const shown = managedCourses.filter(
    (course) => course.status === "منشور" && (filter === "الكل" || course.category === filter),
  );
  return (
    <PublicPage active="training">
      <section className="inner-page container">
        <PageIntro
          title="أكاديمية التدريب"
          subtitle="دورات عملية تساعدك على تطوير مهارات التوعية والصحة المجتمعية."
          action={<a className="button button-outline" href="#/user">دوراتي</a>}
        />
        <ChipFilters
          items={["الكل", "النظافة", "القوارض والآفات", "المياه والصرف الصحي", "التواصل المجتمعي"]}
          selected={filter}
          onSelect={setFilter}
        />
        <div className="course-grid">
          {shown.map((course) => <CourseCard course={course} key={course.title} />)}
        </div>
      </section>
    </PublicPage>
  );
}

const lessons = [
  "الوحدة ١: التعرف على القوارض",
  "الوحدة ٢: علامات وجود القوارض",
  "الوحدة ٣: أسباب انتشار القوارض",
  "الوحدة ٤: الوقاية والمكافحة الآمنة",
  "الوحدة ٥: اختبار قصير",
];

function CourseDetailsPage() {
  const [openLesson, setOpenLesson] = useState(0);
  return (
    <PublicPage active="training">
      <section className="detail-page container">
        <a className="back-link" href="#/training"><Icon name="arrow" size={18} />العودة إلى الأكاديمية</a>
        <div className="course-detail-hero">
          <div className="course-detail-copy">
            <span className="soft-tag">القوارض والآفات</span>
            <h1>أساسيات مكافحة القوارض</h1>
            <p>دورة تمهيدية لفهم سلوك القوارض وعلامات انتشارها واختيار ممارسات الوقاية والمكافحة الآمنة.</p>
            <div className="meta-grid">
              <MetaItem label="مدة الدورة" value="ساعتان" />
              <MetaItem label="المستوى" value="مبتدئ" />
              <MetaItem label="عدد الدروس" value="٥ دروس" />
            </div>
            <ProgressBar value={65} />
            <a className="button button-orange" href="#/learn/rodent-basics">ابدأ التعلم</a>
          </div>
          <div className="course-detail-image"><img src={photos.inspection} alt="تقييم ميداني لمخاطر النفايات والآفات في غزة" /></div>
        </div>
        <div className="course-content-layout">
          <div className="reading-block">
            <h2>ماذا ستتعلم؟</h2>
            <p>ستتمكن من التعرف على الأنواع الشائعة، قراءة العلامات، تقليل مصادر الجذب، ووضع خطة وقاية قابلة للتطبيق.</p>
            <div className="check-list">
              {["تمييز العلامات المبكرة", "تقييم عوامل الخطورة", "تطبيق الوقاية الآمنة"].map((text) => <div key={text}><Icon name="check" />{text}</div>)}
            </div>
          </div>
          <div className="lesson-list">
            <h2>محتوى الدورة</h2>
            {lessons.map((lesson, index) => (
              <button className={openLesson === index ? "open" : ""} key={lesson} onClick={() => setOpenLesson(index)} type="button">
                <span>{index + 1}</span>
                <strong>{lesson}</strong>
                <small>{openLesson === index ? "مفتوح" : "١٥ دقيقة"}</small>
              </button>
            ))}
          </div>
        </div>
      </section>
    </PublicPage>
  );
}

function LearningPage() {
  const [lesson, setLesson] = useState(0);
  return (
    <div className="learning-page">
      <header className="learning-header">
        <Logo />
        <div><strong>أساسيات مكافحة القوارض</strong><span>تقدم الدورة ٦٥٪</span></div>
        <a className="button button-outline" href="#/course/rodent-basics">الخروج من الدرس</a>
      </header>
      <div className="learning-layout">
        <aside className="lesson-sidebar">
          <span className="sidebar-kicker">محتوى الدورة</span>
          {lessons.map((item, index) => (
            <button className={lesson === index ? "active" : ""} key={item} onClick={() => setLesson(index)} type="button">
              <span>{index + 1}</span>{item}
            </button>
          ))}
        </aside>
        <main className="lesson-main">
          <div className="lesson-video"><Icon name="play" size={54} /><span>مادة تعليمية مرئية</span></div>
          <div className="lesson-reading">
            <span className="soft-tag">الوحدة {lesson + 1}</span>
            <h1>{lessons[lesson].split(": ")[1]}</h1>
            <p>تعرّف في هذا الدرس على المفاهيم الأساسية من خلال شرح واضح وأمثلة ميدانية قابلة للتطبيق.</p>
            <div className="lesson-actions">
              <button className="button button-outline" disabled={lesson === 0} onClick={() => setLesson(Math.max(0, lesson - 1))} type="button">الدرس السابق</button>
              {lesson < lessons.length - 1 ? (
                <button className="button button-orange" onClick={() => setLesson(lesson + 1)} type="button">إكمال والانتقال</button>
              ) : (
                <button className="button button-orange" type="button">تحميل الشهادة</button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

type KnowledgeArticle = {
  id: string;
  title: string;
  type: string;
  topic: string;
  excerpt: string;
  readingTime: string;
  introduction: string;
  sections: Array<{ title: string; body: string }>;
  recommendations: string[];
  takeaways: string[];
};

const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "integrated-rodent-prevention",
    title: "الوقاية المتكاملة من القوارض في بيئات النزوح",
    type: "أدلة فنية",
    topic: "القوارض والآفات",
    excerpt: "نهج عملي يجمع بين الرصد والنظافة البيئية وإدارة مصادر الطعام والمداخل.",
    readingTime: "8 دقائق",
    introduction: "تزداد مخاطر القوارض في البيئات المكتظة عندما تتوفر النفايات والمياه والمداخل غير المحمية. توضح هذه المادة خطوات وقائية متكاملة وآمنة قابلة للتطبيق ميدانيًا.",
    sections: [
      { title: "فهم عوامل الخطورة", body: "ابدأ بتحديد مصادر الطعام والماء، نقاط تراكم النفايات، ومسارات الحركة والفتحات القريبة من أماكن السكن والتخزين." },
      { title: "الرصد والتدخل المبكر", body: "يساعد الفحص المنتظم وتوثيق العلامات على معالجة المشكلة قبل اتساعها، مع تجنب لمس الفضلات أو المواد المشتبه بتلوثها." },
    ],
    recommendations: ["حفظ الطعام في أوعية محكمة.", "إزالة النفايات بصورة منتظمة.", "إغلاق الفتحات ومتابعة ظهور العلامات.", "إحالة الحالات المتقدمة إلى فرق مختصة."],
    takeaways: ["الوقاية البيئية هي خط الدفاع الأول.", "الرصد المستمر أكثر فاعلية من الاستجابة المتأخرة.", "المشاركة المجتمعية ضرورية لاستدامة النتائج."],
  },
  {
    id: "household-water-storage",
    title: "أفضل ممارسات تخزين المياه المنزلية",
    type: "أفضل الممارسات",
    topic: "المياه والصرف الصحي",
    excerpt: "إرشادات واضحة لحماية المياه من التلوث أثناء الجمع والنقل والتخزين والاستخدام.",
    readingTime: "6 دقائق",
    introduction: "يمكن أن تتلوث المياه الآمنة أثناء نقلها أو تخزينها. تساعد ممارسات بسيطة ومتسقة على الحفاظ على جودتها داخل المنزل أو المأوى.",
    sections: [
      { title: "اختيار وعاء التخزين", body: "استخدم وعاءً نظيفًا محكم الغطاء ومخصصًا للمياه فقط، وضعه بعيدًا عن النفايات والمواد الكيميائية ومصادر التلوث." },
      { title: "الاستخدام اليومي الآمن", body: "تجنب غمس الأكواب أو الأيدي داخل الوعاء، ونظفه دوريًا باستخدام طريقة آمنة ومناسبة للسياق." },
    ],
    recommendations: ["تغطية أوعية المياه دائمًا.", "استخدام صنبور أو أداة سكب نظيفة.", "فصل مياه الشرب عن مياه التنظيف.", "مراقبة الطعم والرائحة واللون."],
    takeaways: ["سلامة المياه تستمر حتى لحظة الاستهلاك.", "نظافة الوعاء جزء أساسي من جودة المياه.", "الرسائل البسيطة تسهل تبني الممارسة."],
  },
  {
    id: "waste-and-pest-control",
    title: "إدارة النفايات والحد من انتشار الآفات",
    type: "مقالات",
    topic: "إدارة النفايات",
    excerpt: "كيف تسهم إدارة النفايات في تقليل مصادر جذب القوارض والحشرات وحماية المجتمع.",
    readingTime: "5 دقائق",
    introduction: "تؤثر طريقة جمع النفايات وتخزينها والتخلص منها مباشرة في انتشار الآفات وفي سلامة المساحات المشتركة.",
    sections: [
      { title: "النفايات كمصدر جذب", body: "تجذب بقايا الطعام والحاويات المفتوحة القوارض والحشرات، خاصة عند تراكمها قرب أماكن السكن أو نقاط المياه." },
      { title: "تنظيم نقاط التجميع", body: "ينبغي تحديد نقاط واضحة ومغطاة يسهل الوصول إليها وتنظيفها، مع وضع جدول منتظم للنقل والمتابعة." },
    ],
    recommendations: ["استخدام حاويات مغطاة.", "فصل النفايات الحادة والخطرة.", "تنظيف محيط نقاط التجميع.", "الإبلاغ عن التراكم أو التسرب."],
    takeaways: ["بيئة أنظف تعني مصادر جذب أقل.", "التنظيم المجتمعي يحسن استدامة الخدمة.", "المراقبة اليومية تمنع تراكم المخاطر."],
  },
  {
    id: "rodent-signs",
    title: "علامات وجود القوارض وكيفية التعامل معها",
    type: "مقالات",
    topic: "القوارض والآفات",
    excerpt: "تعرّف على العلامات المبكرة والإجراءات الآمنة التي يجب اتخاذها دون تعريض الأسرة للخطر.",
    readingTime: "5 دقائق",
    introduction: "يساعد التعرف المبكر على آثار القضم والفضلات ومسارات الحركة في الحد من المخاطر واتخاذ إجراءات وقائية مناسبة.",
    sections: [
      { title: "العلامات الأكثر شيوعًا", body: "ابحث عن آثار القضم والفضلات والعبوات المتضررة والفتحات الصغيرة، دون لمس أي علامة مباشرة." },
      { title: "الاستجابة الآمنة", body: "اعزل مصادر الطعام ونظف المنطقة باتباع إرشادات السلامة، ثم اطلب دعم الفريق المختص عند استمرار العلامات." },
    ],
    recommendations: ["عدم لمس الفضلات باليد.", "حماية الأغذية والمياه.", "تسجيل مكان وتاريخ العلامات.", "متابعة الموقع بعد المعالجة."],
    takeaways: ["الاكتشاف المبكر يقلل حجم المشكلة.", "السلامة الشخصية تسبق التنظيف.", "معالجة مصدر الجذب جزء من الحل."],
  },
  {
    id: "hygiene-promotion-emergencies",
    title: "مبادئ تعزيز النظافة في حالات الطوارئ",
    type: "أدلة فنية",
    topic: "تعزيز النظافة",
    excerpt: "مبادئ عملية لفهم المخاطر والأولويات وتصميم استجابة تتمحور حول المجتمع.",
    readingTime: "7 دقائق",
    introduction: "تعزيز النظافة في الطوارئ ليس نقلًا للمعلومات فقط، بل عملية تشاركية تربط الخدمات بالقدرة على تبني الممارسات الآمنة.",
    sections: [
      { title: "الاستماع قبل الرسائل", body: "ابدأ بفهم الممارسات الحالية والعوائق والاحتياجات من خلال حوار يحترم المعرفة المحلية وكرامة المشاركين." },
      { title: "ربط الرسائل بالخدمات", body: "لا تكون الرسالة قابلة للتطبيق دون توفر المياه والصابون والمرافق المناسبة والوصول الآمن إليها." },
    ],
    recommendations: ["تحديد السلوكيات ذات الأولوية.", "اختبار الرسائل مع المجتمع.", "استخدام قنوات تواصل متنوعة.", "متابعة الملاحظات وتكييف التدخل."],
    takeaways: ["المشاركة أساس التغيير.", "الخدمة والرسالة يجب أن تتكاملا.", "التغذية الراجعة تحسن جودة الاستجابة."],
  },
  {
    id: "effective-awareness-session",
    title: "كيفية تنظيم جلسة توعية مجتمعية فعالة",
    type: "أفضل الممارسات",
    topic: "تعزيز النظافة",
    excerpt: "خطوات إعداد وتنفيذ جلسة قصيرة وتفاعلية تركز على الممارسة وليس المحاضرة.",
    readingTime: "8 دقائق",
    introduction: "تنجح جلسات التوعية عندما تكون مرتبطة بالواقع، قصيرة، تفاعلية، وتمنح المشاركين فرصة للتجربة وطرح الأسئلة.",
    sections: [
      { title: "التخطيط للجلسة", body: "حدد هدفًا سلوكيًا واحدًا أو اثنين، واعرف جمهورك، وجهز مثالًا عمليًا ومواد بسيطة مناسبة للمكان." },
      { title: "التيسير والمتابعة", body: "استخدم الأسئلة والعرض العملي، ثم اتفق مع المشاركين على خطوة قابلة للتطبيق وتابعها في الزيارة التالية." },
    ],
    recommendations: ["ابدأ بسؤال من واقع المشاركين.", "استخدم لغة بسيطة.", "خصص وقتًا للتجربة.", "اختم بخطوة عملية واضحة."],
    takeaways: ["التفاعل أهم من كثرة المعلومات.", "الهدف المحدد يسهل التقييم.", "المتابعة تحول المعرفة إلى ممارسة."],
  },
  {
    id: "handwashing-practice-review",
    title: "مراجعة ممارسات غسل اليدين في البيئات المجتمعية",
    type: "دراسات وتقارير",
    topic: "النظافة الشخصية",
    excerpt: "قراءة مختصرة للعوامل التي تساعد الأسر والأطفال على الالتزام بغسل اليدين في الأوقات الحرجة.",
    readingTime: "9 دقائق",
    introduction: "توضح مراجعة الممارسات أن توفر الماء والصابون وسهولة الوصول إلى المحطة والتذكير البصري عوامل مترابطة تؤثر في استمرارية غسل اليدين.",
    sections: [
      { title: "ما الذي يدعم الممارسة؟", body: "تزداد الممارسة عندما تكون المحطة قريبة ونظيفة ومجهزة، وعندما يشارك أفراد الأسرة في تذكير بعضهم بالأوقات الحرجة." },
      { title: "دروس للبرامج الميدانية", body: "ينبغي متابعة الاستخدام الفعلي للمرافق والاستماع إلى ملاحظات المستخدمين بدل الاكتفاء بقياس عدد المحطات أو الجلسات." },
    ],
    recommendations: ["وضع المحطات في مواقع يسهل الوصول إليها.", "ضمان توفر الصابون باستمرار.", "استخدام تذكير بصري بسيط.", "متابعة العوائق مع المستخدمين."],
    takeaways: ["توفر المرفق وحده لا يضمن الاستخدام.", "سهولة الوصول عامل سلوكي مهم.", "المتابعة المجتمعية تكشف العوائق مبكرًا."],
  },
  {
    id: "hygiene-promotion-faq",
    title: "أسئلة شائعة حول تعزيز النظافة في الطوارئ",
    type: "أسئلة شائعة",
    topic: "تعزيز النظافة",
    excerpt: "إجابات عملية عن اختيار الرسائل، تنظيم الجلسات، متابعة الممارسات والتعامل مع الشائعات.",
    readingTime: "6 دقائق",
    introduction: "تجمع هذه المادة إجابات موجزة عن الأسئلة التي تواجه فرق تعزيز النظافة أثناء التخطيط والتنفيذ والمتابعة في سياقات الطوارئ.",
    sections: [
      { title: "كيف نحدد الرسالة ذات الأولوية؟", body: "ابدأ بالخطر الأكثر تأثيرًا والسلوك القابل للتغيير، ثم تحقق من توفر الخدمات والمواد التي تجعل تطبيق الرسالة ممكنًا." },
      { title: "كيف نعرف أن الجلسة نجحت؟", body: "استخدم سؤالًا أو عرضًا عمليًا قصيرًا، ثم تابع لاحقًا ما إذا كان المشاركون استطاعوا تطبيق الخطوة المتفق عليها." },
    ],
    recommendations: ["الإجابة بلغة واضحة ومباشرة.", "الاعتراف بما يحتاج إلى تحقق.", "تحديث الرسائل عند تغير الظروف.", "توثيق الأسئلة المتكررة ومشاركتها مع الفريق."],
    takeaways: ["السؤال المتكرر مؤشر على حاجة حقيقية.", "الإجابة العملية أفضل من الرسالة العامة.", "الاتساق بين الفرق يعزز الثقة."],
  },
];

const featuredKnowledgeIds = [
  "integrated-rodent-prevention",
  "household-water-storage",
  "waste-and-pest-control",
];

function KnowledgeCard({ article }: { article: KnowledgeArticle }) {
  return (
    <article className="knowledge-card">
      <div className="knowledge-card-meta">
        <span>{article.type}</span>
        <span>{article.topic}</span>
      </div>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
      <div className="knowledge-card-footer">
        <small>{article.readingTime}</small>
        <a href={`#/knowledge/${article.id}`}>
          اقرأ المزيد
          <Icon name="arrow" size={17} />
        </a>
      </div>
    </article>
  );
}

function KnowledgeHubPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("الكل");
  const [type, setType] = useState("الكل");
  const visible = knowledgeArticles.filter(
    (article) =>
      (matchesLocalizedText(article.title, query) || matchesLocalizedText(article.excerpt, query)) &&
      (topic === "الكل" || article.topic === topic) &&
      (type === "الكل" || article.type === type),
  );
  const featured = featuredKnowledgeIds
    .map((id) => knowledgeArticles.find((article) => article.id === id))
    .filter((article): article is KnowledgeArticle => Boolean(article));

  return (
    <PublicPage>
      <section className="inner-page knowledge-page container">
        <PageIntro
          title="مركز المعرفة"
          subtitle="معرفة موثوقة وأدلة عملية لدعم العاملين والمجتمعات في تعزيز النظافة والصحة البيئية."
        />
        <div className="knowledge-tools">
          <SearchField placeholder="ابحث في مركز المعرفة..." value={query} onChange={setQuery} />
          <div>
            <span className="filter-label">الموضوع</span>
            <ChipFilters
              items={["الكل", "النظافة الشخصية", "المياه والصرف الصحي", "القوارض والآفات", "إدارة النفايات", "تعزيز النظافة"]}
              selected={topic}
              onSelect={setTopic}
            />
          </div>
          <div>
            <span className="filter-label">نوع المحتوى</span>
            <ChipFilters
              items={["الكل", "مقالات", "أدلة فنية", "دراسات وتقارير", "أفضل الممارسات", "أسئلة شائعة"]}
              selected={type}
              onSelect={setType}
            />
          </div>
        </div>

        <section className="featured-knowledge">
          <div className="knowledge-section-heading">
            <div><span className="eyebrow">موصى به</span><h2>معرفة مختارة</h2></div>
          </div>
          <div className="featured-knowledge-grid">
            {featured.map((article, index) => (
              <a href={`#/knowledge/${article.id}`} key={article.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{article.type}</small>
                <h3>{article.title}</h3>
                <Icon name="arrow" size={19} />
              </a>
            ))}
          </div>
        </section>

        <section className="knowledge-results">
          <div className="knowledge-section-heading">
            <div><span className="eyebrow">المعرفة العملية</span><h2>المقالات والأدلة</h2></div>
            <small>{visible.length} مواد</small>
          </div>
          <div className="knowledge-grid">
            {visible.map((article) => <KnowledgeCard article={article} key={article.id} />)}
          </div>
        </section>
      </section>
    </PublicPage>
  );
}

function KnowledgeArticlePage({ article }: { article: KnowledgeArticle }) {
  return (
    <PublicPage>
      <article className="knowledge-article-page container">
        <a className="back-link" href="#/knowledge"><Icon name="arrow" size={18} />العودة إلى مركز المعرفة</a>
        <header className="knowledge-article-header">
          <div className="knowledge-card-meta"><span>{article.type}</span><span>{article.topic}</span><span>{article.readingTime}</span></div>
          <h1>{article.title}</h1>
          <p>{article.introduction}</p>
        </header>

        <div className="knowledge-article-layout">
          <div className="knowledge-article-body">
            {article.sections.map((section) => (
              <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>
            ))}
            <section className="knowledge-recommendations">
              <h2>توصيات عملية</h2>
              <div>{article.recommendations.map((item) => <p key={item}><Icon name="check" size={19} />{item}</p>)}</div>
            </section>
          </div>
          <aside className="knowledge-takeaways">
            <span className="large-icon"><Icon name="book" /></span>
            <h2>أهم الخلاصات</h2>
            {article.takeaways.map((item) => <p key={item}>{item}</p>)}
          </aside>
        </div>

        <section className="knowledge-related">
          <div className="knowledge-section-heading">
            <div><span className="eyebrow">المكتبة التوعوية</span><h2>مواد ذات صلة</h2></div>
            <a className="button button-outline" href="#/library">استكشف المكتبة</a>
          </div>
          <div className="knowledge-related-grid">
            {resources.map((resource) => (
              <a href="#/resource/rodent-guide" key={resource.title}>
                <span className="resource-icon"><Icon name={resource.icon} size={21} /></span>
                <small>{resource.type}</small>
                <h3>{resource.title}</h3>
                <Icon name="arrow" size={17} />
              </a>
            ))}
          </div>
        </section>
      </article>
    </PublicPage>
  );
}

type ManagedResource = {
  id: string;
  title: string;
  description: string;
  topic: string;
  type: string;
  image: string;
  fileUrl: string;
  status: "مسودة" | "منشور";
};

const libraryItems: ManagedResource[] = [
  { id: "rodent-guide", title: "دليل مكافحة القوارض", description: "دليل عملي للوقاية والرصد الآمن.", type: "دليل", topic: "تعزيز النظافة", image: photos.inspection, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "rodent-signs-material", title: "علامات وجود القوارض في المنزل", description: "مادة تدريبية للتعرف على العلامات.", type: "PDF", topic: "تعزيز النظافة", image: photos.storage, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "rodent-poster", title: "ملصق الوقاية من القوارض", description: "ملصق برسائل وقائية مختصرة.", type: "ملصق", topic: "تعزيز النظافة", image: photos.inspection, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "food-storage-video", title: "التخزين الآمن للطعام", description: "فيديو قصير عن حماية الغذاء.", type: "فيديو", topic: "تعزيز النظافة", image: photos.cleanupClose, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "waste-guide", title: "إدارة النفايات المنزلية", description: "إرشادات لإدارة النفايات بأمان.", type: "مطوية", topic: "الصرف الصحي", image: photos.cleanup, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "handwashing-poster", title: "خطوات غسل اليدين", description: "ملصق توضيحي لخطوات غسل اليدين.", type: "صورة", topic: "تعزيز النظافة", image: photos.handwashing, fileUrl: "#/resource/rodent-guide", status: "منشور" },
];

const awarenessLibraryItems: ManagedResource[] = [
  { id: "water-tanks-library", title: "خزانات المياه وصيانتها", description: "دليل عملي لتنظيف خزانات المياه وصيانتها بصورة دورية.", type: "دليل", topic: "المياه", image: photos.storage, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "water-networks-library", title: "صيانة شبكات المياه", description: "دليل لمتابعة شبكات المياه ورصد التسربات والإبلاغ عن الأعطال.", type: "دليل", topic: "المياه", image: photos.cleanup, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "water-wells-library", title: "آبار المياه", description: "مادة توعوية حول حماية آبار المياه والحفاظ على سلامة مصادرها.", type: "PDF", topic: "المياه", image: photos.cleanWater, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "desalination-plants-library", title: "محطات تحلية المياه", description: "ملصق يوضح دور محطات التحلية ومؤشرات سلامة مياه الشرب.", type: "ملصق", topic: "المياه", image: photos.cleanWater, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "drinking-water-distribution-library", title: "توزيع مياه الشرب", description: "فيديو قصير عن نقل مياه الشرب وتوزيعها وتخزينها بأمان.", type: "فيديو", topic: "المياه", image: photos.storage, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "toilets-maintenance-library", title: "الحمامات وصيانتها", description: "إرشادات للحفاظ على نظافة الحمامات وصيانتها والحد من المخاطر الصحية.", type: "مطوية", topic: "الصرف الصحي", image: photos.cleanupClose, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "sanitation-networks-library", title: "صيانة شبكات الصرف الصحي", description: "دليل لمتابعة شبكات الصرف الصحي ورصد الانسدادات والإبلاغ عن الأعطال.", type: "دليل", topic: "الصرف الصحي", image: photos.cleanup, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "health-education-library", title: "التثقيف الصحي", description: "مادة مصورة تعزز الممارسات الصحية والنظافة الشخصية اليومية.", type: "صورة", topic: "تعزيز النظافة", image: photos.handwashing, fileUrl: "#/resource/rodent-guide", status: "منشور" },
  { id: "rodent-control-library", title: "مكافحة القوارض", description: "مادة تدريبية للتعرف على العلامات وطرق الوقاية والمكافحة الآمنة.", type: "PDF", topic: "تعزيز النظافة", image: photos.inspection, fileUrl: "#/resource/rodent-guide", status: "منشور" },
];

// Shared resource cache: Supabase is the source of truth for library materials.
let resourceCache: ManagedResource[] = libraryItems;
let resourceLoaded = false;
let resourceLoading: Promise<void> | null = null;
const resourceSubscribers = new Set<(items: ManagedResource[]) => void>();
function publishResources(items: ManagedResource[]) {
  resourceCache = items;
  resourceSubscribers.forEach((notify) => notify(items));
}
async function refreshResources(force = false) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  if (resourceLoading) return resourceLoading;
  if (resourceLoaded && !force) return;
  resourceLoading = (async () => {
    const { data, error } = await supabase.from("managed_resources").select("data");
    if (error) throw error;
    publishResources((data ?? []).map((row) => row.data as ManagedResource));
    resourceLoaded = true;
  })();
  try { await resourceLoading; } finally { resourceLoading = null; }
}
function useManagedResources() {
  const [items, setItems] = useState<ManagedResource[]>(resourceCache);
  useEffect(() => {
    resourceSubscribers.add(setItems);
    void refreshResources().catch((error) => console.error("تعذر تحميل المكتبة:", error));
    const { data: authListener } = supabase?.auth.onAuthStateChange(() => {
      void refreshResources(true).catch((error) => console.error("تعذر تحديث المكتبة:", error));
    }) ?? { data: null };
    return () => { resourceSubscribers.delete(setItems); authListener?.subscription.unsubscribe(); };
  }, []);
  return [items, setItems] as const;
}
async function saveResourceToSupabase(resource: ManagedResource) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  const { error } = await supabase.from("managed_resources").upsert({ id: resource.id, data: resource }, { onConflict: "id" });
  if (error) throw error;
  await refreshResources(true);
}
async function deleteResourceFromSupabase(id: string) {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  const { data, error } = await supabase.from("managed_resources").delete().eq("id", id).select("id");
  if (error) throw error;
  if (!data?.length) throw new Error("لم يتم حذف المادة؛ تحقق من صلاحيات الحساب");
  await refreshResources(true);
}

function LibraryPage() {
  const [managedResources] = useManagedResources();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("الكل");
  const [topic, setTopic] = useState("الكل");
  const typeGroups: Record<string, string[]> = {
    "أدلة": ["دليل", "PDF"],
    "ملصقات": ["ملصق", "صورة"],
    "فيديوهات": ["فيديو"],
    "مواد تدريبية": ["مطوية"],
  };
  const visible = managedResources.filter(
    (item) =>
      item.status === "منشور" &&
      matchesLocalizedText(item.title, query) &&
      (type === "الكل" || typeGroups[type]?.includes(item.type)) &&
      (topic === "الكل" || topic === item.topic),
  );
  return (
    <PublicPage active="library">
      <section className="inner-page container">
        <PageIntro title="المكتبة التوعوية" subtitle="أدلة وملصقات وفيديوهات ومواد جاهزة للاستخدام." />
        <div className="library-tools">
          <SearchField placeholder="ابحث في المكتبة..." value={query} onChange={setQuery} />
          <div>
            <span className="filter-label">نوع المادة</span>
            <ChipFilters items={["الكل", "أدلة", "ملصقات", "فيديوهات", "مواد تدريبية"]} selected={type} onSelect={setType} />
          </div>
          <div>
            <span className="filter-label">الموضوع</span>
            <ChipFilters items={["الكل", "المياه", "الصرف الصحي", "تعزيز النظافة"]} selected={topic} onSelect={setTopic} />
          </div>
        </div>
        <div className="library-grid">
          {visible.map((item) => (
            <article className="library-card" key={item.id}>
              <div className="library-thumb"><img src={item.image} alt={item.title} /><span>{item.type}</span></div>
              <div className="library-body"><small>{item.topic}</small><h3>{item.title}</h3><div><a href={`#/resource/${item.id}`}>عرض</a><button type="button" onClick={() => { if (/^https?:|^data:|^blob:/.test(item.fileUrl)) { window.open(item.fileUrl, "_blank", "noopener,noreferrer"); } else { window.alert("لا يوجد ملف مرفق قابل للتحميل لهذه المادة حاليًا."); } }}>تحميل</button></div></div>
            </article>
          ))}
        </div>
      </section>
    </PublicPage>
  );
}

function ResourcePreviewPage({ resource }: { resource: ManagedResource }) {
  return (
    <PublicPage active="library">
      <section className="detail-page container">
        <a className="back-link" href="#/library"><Icon name="arrow" size={18} />العودة إلى المكتبة التوعوية</a>
        <div className="resource-preview">
          <div className="document-preview">
            <div className="document-page">
              <span>{resource.type}</span>
              <img className="resource-preview-image" src={resource.image} alt={resource.title} />
              <h2>{resource.title}</h2>
              <p>{resource.description}</p>
            </div>
          </div>
          <div className="detail-summary">
            <span className="soft-tag">{resource.topic}</span>
            <h1>{resource.title}</h1>
            <p>{resource.description}</p>
            <div className="meta-grid"><MetaItem label="الموضوع" value={resource.topic} /><MetaItem label="نوع المادة" value={resource.type} /><MetaItem label="اللغة" value="العربية" /><MetaItem label="الحالة" value="متاح" /></div>
            <button className="button button-orange" type="button" onClick={() => { if (/^https?:|^data:|^blob:/.test(resource.fileUrl)) { window.open(resource.fileUrl, "_blank", "noopener,noreferrer"); } else { window.alert("لا يوجد ملف مرفق قابل للتحميل لهذه المادة حاليًا."); } }}>تحميل المادة</button>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}

const events = [
  ["اليوم العالمي لغسل اليدين", "١٥ أكتوبر", "جلسات توعوية مجتمعية", photos.handwashing],
  ["أسبوع مكافحة القوارض والآفات", "٢١ أكتوبر", "زيارات وفحوص ميدانية", photos.inspection],
  ["حملة بيئة نظيفة", "٣ نوفمبر", "حملة نظافة تطوعية", photos.cleanup],
  ["اليوم العالمي للمياه", "٢٢ مارس", "فعاليات للتوعية بالمياه الآمنة", photos.cleanWater],
];

function CampaignsPage() {
  const [managedEvents] = useManagedEvents();
  return (
    <PublicPage active="campaigns">
      <section className="inner-page container">
        <PageIntro title="الحملات والفعاليات" subtitle="شارك في المبادرات القادمة وساهم في بناء مجتمع أكثر صحة." />
        <div className="campaign-layout">
          <div>
            <h2 className="subsection-title">الفعاليات القادمة</h2>
            <div className="event-list">
              {managedEvents.map((event) => (
                <a className="event-card" href={`#/event/${event.id}`} key={event.id}>
                  <img src={event.image ?? (event.icon === "hand" ? photos.handwashing : event.icon === "drop" ? photos.cleanWater : photos.cleanup)} alt={event.name} />
                  <div><span>{formatEventDate(event)}</span><h3>{event.name}</h3><p>{event.description}</p></div>
                  <Icon name="arrow" />
                </a>
              ))}
            </div>
          </div>
          <Calendar events={managedEvents} />
        </div>
      </section>
    </PublicPage>
  );
}

function Calendar({ events: calendarEvents = awarenessEvents }: { events?: AwarenessEvent[] }) {
  const days = Array.from({ length: 35 }, (_, index) => index - 2);
  return (
    <aside className="calendar-card">
      <div className="calendar-title"><h3>أكتوبر ٢٠٢٥</h3><span>الشهر الحالي</span></div>
      <div className="weekdays">{["س", "ح", "ن", "ث", "ر", "خ", "ج"].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="calendar-days">{days.map((day, index) => <span className={calendarEvents.some((event) => event.month === 10 && event.day === day) ? "event-day" : ""} key={index}>{day > 0 && day <= 31 ? day : ""}</span>)}</div>
      <div className="calendar-note"><span className="status-dot"></span>{calendarEvents.filter((event) => event.month === 10).length} أيام تحتوي على فعاليات</div>
    </aside>
  );
}

function EventDetailsPage({ event }: { event: AwarenessEvent }) {
  return (
    <PublicPage active="campaigns">
      <section className="detail-page container">
        <a className="back-link" href="#/campaigns"><Icon name="arrow" size={18} />العودة إلى الفعاليات</a>
        <div className="detail-hero">
          <div className="event-detail-visual">
            <span><Icon name={event.icon} size={68} /></span>
            <small>{event.category}</small>
          </div>
          <div className="detail-summary">
            <span className="soft-tag">{event.category}</span>
            <h1>{event.name}</h1>
            <p>{event.description}</p>
            <div className="meta-grid">
              <MetaItem label="اسم المناسبة" value={event.name} />
              <MetaItem label="التاريخ" value={formatEventDate(event)} />
            </div>
            <a className="button button-orange" href="#event-suggestions">استكشف الأنشطة المقترحة</a>
          </div>
        </div>
        <div className="event-detail-content" id="event-suggestions">
          <article className="event-importance">
            <span className="large-icon"><Icon name="shield" /></span>
            <div><h2>لماذا هذه المناسبة مهمة؟</h2><p>{event.importance}</p></div>
          </article>
          <div className="event-related-grid">
            <article>
              <h2>أنشطة مقترحة</h2>
              {event.activities.map((item, index) => (
                <a href="#/activities" key={item}><span>{index + 1}</span><strong>{item}</strong><Icon name="arrow" size={17} /></a>
              ))}
            </article>
            <article>
              <h2>مواد توعوية مرتبطة</h2>
              {event.resources.map((item) => (
                <a href="#/library" key={item}><span className="file-mark">PDF</span><strong>{item}</strong><Icon name="arrow" size={17} /></a>
              ))}
            </article>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}

const tools = [
  { title: "قائمة فحص القوارض", type: "PDF", file: "rodent-checklist.pdf" },
  { title: "نموذج زيارة ميدانية", type: "Word", file: "field-visit.docx" },
  { title: "تقرير النشاط", type: "Word", file: "activity-report.docx" },
  { title: "قائمة الحضور", type: "Excel", file: "attendance.xlsx" },
  { title: "نموذج تقييم النظافة", type: "PDF", file: "hygiene-assessment.pdf" },
  { title: "نموذج رصد الآفات", type: "Excel", file: "pest-monitoring.xlsx" },
];

function FieldToolsPage() {
  return (
    <PublicPage>
      <section className="inner-page container">
        <PageIntro title="الأدوات الميدانية" subtitle="نماذج وقوائم تحقق تساعد الفرق أثناء العمل الميداني." />
        <div className="tool-grid">
          {tools.map(({ title, type, file }) => {
            const fileUrl = `${import.meta.env.BASE_URL}field-tools/${file}`;
            return (
              <article className="tool-card" key={title}>
                <span className="file-mark">{type}</span>
                <div><small>{type}</small><h3>{title}</h3></div>
                <div>
                  <button type="button" onClick={() => window.open(fileUrl, "_blank", "noopener,noreferrer")}>معاينة</button>
                  <button className="primary" type="button" onClick={() => { const link = document.createElement("a"); link.href = fileUrl; link.download = file; document.body.appendChild(link); link.click(); link.remove(); }}>تحميل</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PublicPage>
  );
}

const planRows = [
  ["أكتوبر", "تحدي غسل اليدين", "مدرسة الأمل", "الأطفال", "مكتمل"],
  ["أكتوبر", "فحص بيئي وقائي", "حي النور", "الأسر", "قيد التنفيذ"],
  ["نوفمبر", "حملة بيئة نظيفة", "الساحة العامة", "المجتمع", "مخطط"],
  ["نوفمبر", "جلسة المياه الآمنة", "المركز المجتمعي", "الأمهات", "مخطط"],
];

function PlanningPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <PublicPage>
      <section className="inner-page container">
        <PageIntro title="مركز التخطيط" subtitle="خطط للأنشطة والحملات القادمة في مساحة واضحة وبسيطة." action={<button className="button button-orange" onClick={() => setShowForm(!showForm)} type="button">+ إضافة خطة</button>} />
        {showForm && <InlineForm title="إضافة خطة جديدة" onClose={() => setShowForm(false)} />}
        <div className="summary-grid">
          {[["الأنشطة المخططة", "١٢"], ["الحملات القادمة", "٤"], ["المواقع المستهدفة", "٨"], ["المستفيدون المستهدفون", "١٬٢٥٠"]].map(([label, value]) => <div className="summary-card" key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
        <DataTable headers={["الشهر", "النشاط", "الموقع", "الفئة المستهدفة", "الحالة"]} rows={planRows} statusColumn={4} />
      </section>
    </PublicPage>
  );
}

function InlineForm({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="inline-form">
      <div className="form-title"><h2>{title}</h2><button onClick={onClose} type="button">إغلاق</button></div>
      <div className="form-grid"><label>اسم النشاط<input placeholder="أدخل اسم النشاط" /></label><label>الموقع<input placeholder="حدد الموقع" /></label><label>التاريخ<input type="date" /></label><label>الفئة المستهدفة<input placeholder="مثال: الأسر" /></label></div>
      <div className="form-actions"><button className="button button-outline" onClick={onClose} type="button">إلغاء</button><button className="button button-orange" type="button">حفظ</button></div>
    </div>
  );
}

function DataTable({ headers, rows, statusColumn }: { headers: string[]; rows: string[][]; statusColumn?: number }) {
  return (
    <div className="table-wrap">
      <table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, index) => <td key={index}>{statusColumn === index ? <span className={`status-badge status-${cell}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table>
    </div>
  );
}

function ChartCard({ title, type = "bars", monthly, distribution, goalTarget, goalAchieved }: {
  title: string;
  type?: "bars" | "donut" | "goal";
  monthly?: number[];
  distribution?: [number, number, number];
  goalTarget?: number | null;
  goalAchieved?: number | null;
}) {
  const months = ["ماي", "يون", "يول", "أغس", "سبت", "أكت"];
  const chartValues = monthly ?? [0, 0, 0, 0, 0, 0];
  const maximum = Math.max(1, ...chartValues);
  const [families, children, teams] = distribution ?? [0, 0, 0];
  const total = families + children + teams;
  const familiesPct = total ? (families / total) * 100 : 0;
  const childrenPct = total ? (children / total) * 100 : 0;
  const familiesEnd = familiesPct;
  const childrenEnd = familiesPct + childrenPct;
  return (
    <article className="chart-card">
      <div className="chart-heading"><h3>{title}</h3><span>{type === "bars" ? "آخر ٦ أشهر" : "بيانات المدير"}</span></div>
      {type === "bars" && <div className="bar-chart">{chartValues.map((value, index) => <div key={index} title={`${months[index]}: ${value}`}><span style={{ height: `${(value / maximum) * 100}%` }}></span><small>{months[index]}</small><small dir="ltr">{value.toLocaleString("en-US")}</small></div>)}</div>}
      {type === "donut" && <div className="donut-wrap"><div className="donut" style={{ background: total ? `conic-gradient(#566b2e 0% ${familiesEnd}%, #75883d ${familiesEnd}% ${childrenEnd}%, #d9a51a ${childrenEnd}% 100%)` : "conic-gradient(#e5e7e0 0% 100%)" }}><span dir="ltr">{Math.round(familiesPct)}%</span></div><div className="legend"><span><i></i>أسر: {families.toLocaleString("en-US")}</span><span><i></i>أطفال: {children.toLocaleString("en-US")}</span><span><i></i>فرق ميدانية: {teams.toLocaleString("en-US")}</span></div></div>}
      {type === "goal" && (goalTarget == null || goalAchieved == null ?
        <p>لم يتم إدخال بيانات المستهدف والمتحقق بعد.</p> :
        <div style={{ padding: "24px 8px", display: "grid", gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <strong>نسبة الإنجاز</strong>
            <strong dir="ltr" style={{ fontSize: 26, color: "#566b2e" }}>{goalTarget > 0 ? `${Math.round(goalAchieved / goalTarget * 100)}%` : "—"}</strong>
          </div>
          {([ ["المستهدف", goalTarget, "#d9a51a"], ["المتحقق", goalAchieved, "#566b2e"] ] as const).map(([label, value, color]) =>
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span>{label}</span><strong dir="ltr">{value.toLocaleString("en-US")}</strong></div>
              <div style={{ height: 15, borderRadius: 10, background: "#e5e7e0", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, value / Math.max(1, goalTarget, goalAchieved) * 100)}%`, height: "100%", background: color, borderRadius: 10 }} />
              </div>
            </div>
          )}
          {goalTarget === 0 && <small>المستهدف صفر؛ لا يمكن حساب نسبة الإنجاز.</small>}
        </div>
      )}
    </article>
  );
}

function MonitoringPage() {
  const settings = usePlatformSettings();
  const [activities] = useManagedActivities();
  const [courses] = useManagedCourses();
  const [resources] = useManagedResources();

  // Public monitoring only counts published records, never drafts.
  const publishedActivities = activities.filter((item) => item.status === "منشور").length;
  const publishedCourses = courses.filter((item) => item.status === "منشور").length;
  const publishedResources = resources.filter((item) => item.status === "منشور").length;
  const beneficiaries = Math.max(0, Number(settings.impactBeneficiaries) || 0);
  const distribution: [number, number, number] = [
    Math.max(0, Number(settings.chartFamilies) || 0),
    Math.max(0, Number(settings.chartChildren) || 0),
    Math.max(0, Number(settings.chartFieldTeams) || 0),
  ];
  const monthly = (settings.chartMonthly ?? defaultPlatformSettings.chartMonthly)
    .slice(0, 6).map((value) => Math.max(0, Number(value) || 0));

  return (
    <PublicPage>
      <section className="inner-page container">
        <PageIntro title="المتابعة والتقييم" subtitle="نظرة مختصرة على التقدم والأثر المحقق." action={<a className="button button-orange" href="#/reports">عرض التقارير</a>} />
        <KpiGrid items={[
          ["الأنشطة المنشورة", publishedActivities.toLocaleString("en-US")],
          ["عدد المستفيدين", beneficiaries.toLocaleString("en-US")],
          ["الدورات المنشورة", publishedCourses.toLocaleString("en-US")],
          ["مواد المكتبة المنشورة", publishedResources.toLocaleString("en-US")],
        ]} />
        <div className="charts-grid">
          <ChartCard title="تقدم الأنشطة" monthly={monthly} />
          <ChartCard title="توزيع المستفيدين" type="donut" distribution={distribution} />
          <ChartCard title="المستهدف مقابل المتحقق" type="goal" goalTarget={settings.goalTarget} goalAchieved={settings.goalAchieved} />
        </div>
        <p className="monitoring-data-note">البيانات من Supabase: أعداد المحتوى المنشور مباشرة، وإحصائيات المستفيدين والأنشطة الشهرية من إعدادات المدير. مقارنة المستهدف والمتحقق تعتمد على القيم التي يحفظها المدير في إعدادات المنصة.</p>
        <div className="recent-reports"><h2>آخر التقارير</h2>{["تقرير الأنشطة الشهري", "تقرير حملة بيئة نظيفة", "تقرير جلسات المدارس"].map((item, index) => <a href="#/reports" key={item}><span className="file-mark">PDF</span><strong>{item}</strong><small>{index + 12} أكتوبر ٢٠٢٥</small><Icon name="arrow" /></a>)}</div>
      </section>
    </PublicPage>
  );
}

function KpiGrid({ items }: { items: string[][] }) {
  return <div className="kpi-grid">{items.map(([label, value]) => <div className="kpi-card" key={label}><span>{label}</span><strong>{value}</strong><small>محدّث اليوم</small></div>)}</div>;
}

const userNav = [
  ["لوحة التحكم", "user"],
  ["أنشطتي", "user/activities"],
  ["دوراتي", "user/courses"],
  ["المكتبة", "library"],
  ["الشهادات", "user/certificates"],
  ["الإشعارات", "user/notifications"],
  ["الإعدادات", "settings"],
];

const adminNav = [
  ["نظرة عامة", "admin"],
  ["إدارة الأنشطة", "admin/activities"],
  ["إدارة الدورات", "admin/courses"],
  ["إدارة المكتبة", "admin/library"],
  ["إدارة المناسبات", "admin/events"],
  ["المستخدمون", "admin/users"],
  ["المراسلات الداخلية", "admin/messages"],
  ["التقارير", "admin/reports"],
  ["الإعدادات", "admin/settings"],
];

function DashboardShell({ admin = false, active, children }: { admin?: boolean; active: string; children: React.ReactNode }) {
  const navItems = admin ? adminNav : userNav;
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [accountRole, setAccountRole] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    let requestId = 0;
    const updateAccount = async (user: { id: string; email?: string } | null) => {
      const currentRequest = ++requestId;
      if (!user) {
        if (alive) { setAccountEmail(""); setAccountRole(""); }
        return;
      }
      if (alive) setAccountEmail(user.email ?? "");
      const { data, error } = await supabase!.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
      if (alive && currentRequest === requestId) setAccountRole(error ? "" : data?.role ?? "employee");
    };
    void supabase.auth.getUser().then(({ data }) => updateAccount(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      void updateAccount(session?.user ?? null);
      setAccountOpen(false);
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, []);

  const logout = async () => {
    if (!supabase || loggingOut) return;
    setLoggingOut(true);
    setLogoutError("");
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLogoutError("تعذر تسجيل الخروج. حاول مرة ثانية.");
      setLoggingOut(false);
      return;
    }
    setAccountOpen(false);
    window.location.hash = "#/login";
    setLoggingOut(false);
  };

  useEffect(() => {
    let timeout = 0;
    const showToast = (message: string, clearPending = true) => {
      if (clearPending) window.sessionStorage.removeItem("admin-toast");
      setToast(message);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setToast(""), 2800);
    };
    const pending = window.sessionStorage.getItem("admin-toast");
    if (pending) showToast(pending);
    const onToast = (event: Event) => {
      showToast((event as CustomEvent<string>).detail, false);
      window.setTimeout(() => window.sessionStorage.removeItem("admin-toast"), 500);
    };
    window.addEventListener("admin-toast", onToast);
    return () => {
      window.removeEventListener("admin-toast", onToast);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="dashboard-shell">
      {menuOpen && <button type="button" className="dashboard-mobile-backdrop" aria-label="إغلاق القائمة" onClick={() => setMenuOpen(false)} />}
      <aside className={`dashboard-sidebar${menuOpen ? " mobile-open" : ""}`}>
        <button type="button" className="dashboard-sidebar-close" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة">×</button>
        <div className="dashboard-sidebar-brand"><Logo /><span className="dashboard-sidebar-brand-caption">{admin ? "لوحة الإدارة" : "مساحتي"}</span></div>
        <span className="sidebar-kicker">القائمة الرئيسية</span>
        <nav>{navItems.map(([label, route]) => <a className={active === route ? "active" : ""} href={routeHref(route)} key={label} onClick={() => setMenuOpen(false)}><span className="nav-dot"></span>{label}</a>)}</nav>
        <a className="sidebar-logout" href="#/">العودة إلى المنصة</a>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="dashboard-menu-toggle" onClick={() => setMenuOpen((open) => !open)} type="button" aria-label="فتح قائمة لوحة التحكم"><span></span><span></span><span></span></button>
          <div className="dashboard-topbar-copy"><span>{admin ? "إدارة المنصة" : "مرحبًا، محمد"}</span><small>{admin ? "الثلاثاء، ١٤ أكتوبر" : "يسعدنا أن نراك مجددًا"}</small></div>
          <div className="dashboard-topbar-actions">
            <LanguageSwitch />
            <div ref={accountRef} style={{ position: "relative", display: "flex", alignItems: "center", zIndex: 100 }}>
              <button
                className="avatar"
                type="button"
                aria-label="قائمة حساب المستخدم"
                aria-haspopup="true"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
                style={{ border: 0, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >{accountEmail ? accountEmail.charAt(0).toUpperCase() : "م"}</button>
              {accountOpen && (
                <div
                  dir="rtl"
                  role="group"
                  aria-label="معلومات الحساب"
                  style={{ position: "absolute", top: "calc(100% + 12px)", insetInlineEnd: 0, width: "min(310px, calc(100vw - 28px))", padding: "18px", background: "#fff", color: "#263126", border: "1px solid #e6e9df", borderRadius: "16px", boxShadow: "0 14px 36px rgba(30, 45, 20, .16)", textAlign: "right", lineHeight: 1.6 }}
                >
                  <div style={{ fontWeight: 800, fontSize: "16px", marginBottom: "5px" }}>حسابي</div>
                  <div dir="ltr" style={{ fontSize: "13px", color: "#5f695b", overflowWrap: "anywhere", textAlign: "right" }}>{accountEmail || "جارٍ تحميل البريد الإلكتروني..."}</div>
                  <div style={{ borderTop: "1px solid #edf0e9", margin: "14px 0", paddingTop: "12px", display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "14px" }}>
                    <span style={{ color: "#697365" }}>الصلاحية</span>
                    <strong>{accountRole === "manager" ? "مدير" : accountRole === "assistant_manager" ? "مساعد مدير" : accountRole === "employee" ? "موظف" : "جارٍ التحقق..."}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    disabled={loggingOut}
                    style={{ display: "block", width: "100%", background: "#fff4f1", border: "1px solid #f3d5cf", color: "#a32d22", borderRadius: "10px", padding: "10px 12px", fontSize: "14px", fontWeight: 700, cursor: loggingOut ? "wait" : "pointer", fontFamily: "inherit", textAlign: "right" }}
                  >{loggingOut ? "جارٍ تسجيل الخروج..." : "↪ تسجيل الخروج"}</button>
                  {logoutError && <div role="alert" style={{ color: "#a32d22", fontSize: "12px", marginTop: "8px" }}>{logoutError}</div>}
                </div>
              )}
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
      {toast && <div className="admin-toast" role="status">{toast}</div>}
    </div>
  );
}

function UserDashboard() {
  return (
    <DashboardShell active="user">
      <div className="dashboard-content">
        <DashboardTitle title="لوحة التحكم" subtitle="تابع تقدمك واكتشف ما يناسب اهتماماتك." />
        <KpiGrid items={[["الدورات المكتملة", "٣"], ["الدورات قيد التقدم", "٢"], ["الأنشطة المحفوظة", "٦"], ["الشهادات", "٣"]]} />
        <section className="dashboard-section"><div className="section-title-row"><h2>تابع تعلمك</h2><a href="#/training">جميع الدورات</a></div><div className="current-courses">{courses.filter((c) => c.progress > 0).map((course) => <div key={course.title}><img src={course.image} alt="" /><div><h3>{course.title}</h3><ProgressBar value={course.progress} /><a href="#/course/rodent-basics">متابعة الدورة</a></div></div>)}</div></section>
        <section className="dashboard-section"><div className="section-title-row"><h2>أنشطة مقترحة لك</h2><a href="#/activities">عرض الأنشطة</a></div><div className="suggested-grid">{fullActivities.slice(0, 3).map((item) => <a href={`#/activity/${item.id}`} key={item.title}><img src={item.image} alt="" /><span>{item.category}</span><h3>{item.title}</h3></a>)}</div></section>
        <section className="certificate-strip"><div><span className="large-icon"><Icon name="book" /></span><div><small>آخر الشهادات</small><h3>شهادة أساسيات تعزيز النظافة</h3></div></div><button className="button button-outline" type="button">تحميل الشهادة</button></section>
      </div>
    </DashboardShell>
  );
}

function UserCoursesPage() {
  return (
    <DashboardShell active="user/courses">
      <div className="dashboard-content">
        <DashboardTitle
          title="دوراتي"
          subtitle="تابع الدورات المسجلة وواصل التعلّم من حيث توقفت."
          action={<a className="button button-orange" href="#/training">استكشف الدورات</a>}
        />
        <div className="course-grid dashboard-course-grid">
          {courses.slice(0, 3).map((course) => (
            <CourseCard course={course} key={course.title} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

function DashboardTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className="dashboard-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

function AdminDashboard() {
  const [managedActivities] = useManagedActivities();
  const settings = usePlatformSettings();
  return (
    <DashboardShell active="admin" admin>
      <div className="dashboard-content">
        <DashboardTitle title="نظرة عامة" subtitle="ملخص أداء المنصة والأنشطة الحالية." action={<div className="quick-actions"><a href="#/admin/activities/new">+ إضافة نشاط</a><a href="#/admin/courses/new">+ إضافة دورة</a><a href="#/admin/library/new">+ إضافة مادة</a></div>} />
        <KpiGrid items={[["جلسة منفذة", settings.impactSessions.toLocaleString("en-US")], ["مستفيد", settings.impactBeneficiaries.toLocaleString("en-US")], ["دورة تدريبية", settings.impactCourses.toLocaleString("en-US")], ["مادة توعوية", settings.impactResources.toLocaleString("en-US")]]} />
        <div className="admin-charts"><ChartCard title="الأنشطة الشهرية" monthly={settings.chartMonthly ?? defaultPlatformSettings.chartMonthly} /><ChartCard title="توزيع المستفيدين" type="donut" distribution={[settings.chartFamilies ?? 0, settings.chartChildren ?? 0, settings.chartFieldTeams ?? 0]} /></div>
        <section className="dashboard-section"><div className="section-title-row"><h2>الأنشطة الأخيرة</h2><a href="#/admin/activities">إدارة الأنشطة</a></div><div className="table-wrap"><table><thead><tr><th>اسم النشاط</th><th>التصنيف</th><th>الحالة</th><th>الإجراءات</th></tr></thead><tbody>{managedActivities.slice(0, 4).map((item) => <tr key={item.id}><td>{item.title}</td><td>{item.category}</td><td><span className={`status-badge status-${item.status}`}>{item.status}</span></td><td className="event-actions"><a href={`#/activity/${item.id}`}>عرض</a><a href={`#/admin/activities/edit/${item.id}`}>تعديل</a></td></tr>)}</tbody></table></div></section>
      </div>
    </DashboardShell>
  );
}

function AdminActivitiesPage() {
  const [items] = useManagedActivities();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("الكل");
  const [deleting, setDeleting] = useState<ManagedActivity | null>(null);
  const visible = items.filter(
    (item) => matchesLocalizedText(item.title, query) && (status === "الكل" || item.status === status),
  );
  const remove = async () => {
    if (!deleting) return;
    try {
      await deleteActivityFromSupabase(deleting.id);
      setDeleting(null);
      queueAdminToast("تم حذف العنصر بنجاح");
      window.location.hash = "#/admin/activities";
    } catch (error) {
      alert(`تعذر حذف النشاط: ${error instanceof Error ? error.message : "خطأ غير معروف"}`);
    }
  };
  return (
    <DashboardShell active="admin/activities" admin>
      <div className="dashboard-content">
        <DashboardTitle title="إدارة الأنشطة" subtitle="أضف الأنشطة وحدّث محتواها وحالة نشرها." action={<a className="button button-orange" href="#/admin/activities/new">+ إضافة نشاط جديد</a>} />
        <div className="admin-management-tools"><SearchField placeholder="ابحث عن نشاط..." value={query} onChange={setQuery} /><ChipFilters items={["الكل", "منشور", "مسودة"]} selected={status} onSelect={setStatus} /></div>
        <div className="table-wrap"><table><thead><tr>{["اسم النشاط", "التصنيف", "الفئة المستهدفة", "المدة", "الحالة", "تاريخ الإنشاء", "الإجراءات"].map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{visible.map((item) => <tr key={item.id}><td><strong>{item.title}</strong></td><td>{item.category}</td><td>{item.audience}</td><td>{item.duration}</td><td><span className={`status-badge status-${item.status}`}>{item.status}</span></td><td>{item.createdAt}</td><td className="event-actions"><a href={`#/activity/${item.id}`}>عرض</a><a href={`#/admin/activities/edit/${item.id}`}>تعديل</a><button className="delete-action" onClick={() => setDeleting(item)} type="button">حذف</button></td></tr>)}</tbody></table></div>
        {deleting && <ConfirmDialog message="هل أنت متأكد من حذف هذا النشاط؟" onCancel={() => setDeleting(null)} onConfirm={remove} />}
      </div>
    </DashboardShell>
  );
}

function AdminEventsPage() {
  const [items] = useManagedEvents();
  const [editing, setEditing] = useState<AwarenessEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<AwarenessEvent | null>(null);
  const [formError, setFormError] = useState("");

  const openForm = (event?: AwarenessEvent) => {
    setEditing(event ?? null);
    setFormError("");
    setShowForm(true);
  };

  const saveEvent = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const form = new FormData(formEvent.currentTarget);
    const eventName = String(form.get("name") || "").trim();
    const dateValue = String(form.get("date") || "");
    const description = String(form.get("description") || "").trim();
    if (!eventName) return setFormError("يرجى إدخال اسم المناسبة");
    if (!dateValue || !description || !form.get("category")) return setFormError("يرجى إكمال الحقول المطلوبة");
    setFormError("");
    const [, month = "1", day = "1"] = dateValue.split("-");
    const imageFile = form.get("image");
    try {
    const image = imageFile instanceof File && imageFile.size ? await uploadPublicMedia(imageFile, "images") : editing?.image;
    const nextEvent: AwarenessEvent = {
      id: editing?.id ?? `event-${Date.now()}`,
      name: eventName,
      day: Number(day),
      month: Number(month),
      category: String(form.get("category") || "التوعية المجتمعية"),
      icon: editing?.icon ?? "shield",
      description,
      fullDescription: String(form.get("fullDescription") || ""),
      image,
      importance: editing?.importance ?? "تساعد هذه المناسبة على تعزيز الوعي وتحويل المعرفة إلى ممارسات صحية.",
      activities: String(form.get("activities") || "").split("،").map((item) => item.trim()).filter(Boolean),
      resources: String(form.get("resources") || "").split("،").map((item) => item.trim()).filter(Boolean),
      showOnHomepage: form.get("homepage") === "on",
    };
      await saveEventToSupabase(nextEvent);
    } catch (error) {
      setFormError(`تعذر حفظ المناسبة: ${error instanceof Error ? error.message : "خطأ غير معروف"}`);
      return;
    }
    setShowForm(false);
    setEditing(null);
    queueAdminToast(editing ? "تم حفظ التعديلات" : "تمت إضافة المناسبة بنجاح");
  };

  return (
    <DashboardShell active="admin/events" admin>
      <div className="dashboard-content">
        <DashboardTitle
          title="إدارة المناسبات"
          subtitle="نظّم أيام التوعية واربطها بالمحتوى المناسب في المنصة."
          action={<button className="button button-orange" onClick={() => openForm()} type="button">+ إضافة مناسبة</button>}
        />
        <div className="admin-management-tools"><SearchField placeholder="ابحث عن مناسبة..." value={query} onChange={setQuery} /></div>
        {showForm && (
          <form className="admin-form event-admin-form" noValidate onSubmit={saveEvent}>
            <div className="form-title span-two">
              <h2>{editing ? "تعديل المناسبة" : "إضافة مناسبة"}</h2>
              <button onClick={() => setShowForm(false)} type="button">إغلاق</button>
            </div>
            {formError && <p className="form-error span-two">{formError}</p>}
            <label>اسم المناسبة<input defaultValue={editing?.name} name="name" placeholder="مثال: اليوم العالمي للمياه" required /></label>
            <label>التاريخ<input defaultValue={editing ? `2025-${editing.month.toString().padStart(2, "0")}-${editing.day.toString().padStart(2, "0")}` : ""} name="date" required type="date" /></label>
            <label>المجال<select defaultValue={editing?.category ?? ""} name="category" required><option disabled value="">اختر المجال</option><option>النظافة والصحة</option><option>المياه والصرف الصحي</option><option>البيئة والنفايات</option><option>التوعية المجتمعية</option><option>القوارض والآفات</option></select></label>
            <label className="homepage-toggle"><span>الظهور في الصفحة الرئيسية</span><input defaultChecked={editing?.showOnHomepage !== false} name="homepage" type="checkbox" /></label>
            <label>وصف مختصر<textarea defaultValue={editing?.description} name="description" placeholder="نبذة قصيرة عن المناسبة" required rows={3}></textarea></label>
            <label>وصف كامل<textarea defaultValue={editing?.fullDescription} name="fullDescription" rows={3}></textarea></label>
            <label>صورة<input accept="image/*" name="image" type="file" /></label>
            <label>ربط بأنشطة<input defaultValue={editing?.activities.join("، ")} name="activities" placeholder="اختر أو اكتب أسماء الأنشطة" /></label>
            <label>ربط بمواد توعوية<input defaultValue={editing?.resources.join("، ")} name="resources" placeholder="اختر أو اكتب أسماء المواد" /></label>
            <div className="form-actions span-two">
              <button className="button button-outline" onClick={() => setShowForm(false)} type="button">إلغاء</button>
              <button className="button button-orange" type="submit">حفظ المناسبة</button>
            </div>
          </form>
        )}
        <div className="table-wrap">
          <table>
            <thead><tr><th>اسم المناسبة</th><th>التاريخ</th><th>المجال</th><th>الرئيسية</th><th>الإجراءات</th></tr></thead>
            <tbody>
              {items
                .filter((event) => matchesLocalizedText(event.name, query))
                .slice()
                .sort((a, b) => a.month * 31 + a.day - (b.month * 31 + b.day))
                .map((event) => (
                  <tr key={event.id}>
                    <td><strong>{event.name}</strong></td>
                    <td>{formatEventDate(event)}</td>
                    <td>{event.category}</td>
                    <td><span className="status-badge status-منشور">{event.showOnHomepage !== false ? "ظاهر" : "مخفي"}</span></td>
                    <td className="event-actions">
                      <button onClick={() => openForm(event)} type="button">تعديل</button>
                      <a href={`#/event/${event.id}`}>عرض</a>
                      <button className="delete-action" onClick={() => setDeleting(event)} type="button">حذف</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {deleting && <ConfirmDialog message="هل أنت متأكد من حذف هذه المناسبة؟" onCancel={() => setDeleting(null)} onConfirm={async () => { try { await deleteEventFromSupabase(deleting.id); setDeleting(null); queueAdminToast("تم حذف العنصر بنجاح"); } catch (error) { alert(`تعذر حذف المناسبة: ${error instanceof Error ? error.message : "خطأ غير معروف"}`); } }} />}
      </div>
    </DashboardShell>
  );
}

function ConfirmDialog({ message, onCancel, onConfirm }: { message: string; onCancel: () => void; onConfirm: () => void }) {
  return <div className="confirm-backdrop" role="presentation"><div className="confirm-dialog" role="dialog" aria-modal="true"><h2>{message}</h2><div><button className="button button-outline" onClick={onCancel} type="button">إلغاء</button><button className="button button-orange" onClick={onConfirm} type="button">تأكيد الحذف</button></div></div></div>;
}

const PUBLIC_MEDIA_BUCKET = "platform-media";
const MAX_MEDIA_BYTES = 10 * 1024 * 1024;
const MEDIA_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MEDIA_DOCUMENT_TYPES = new Set([
  "application/pdf", "image/jpeg", "image/png", "image/webp",
  "video/mp4", "video/webm",
]);

async function uploadPublicMedia(file: File, folder: "images" | "materials"): Promise<string> {
  if (!supabase) throw new Error("اتصال Supabase غير مهيأ");
  if (file.size > MAX_MEDIA_BYTES) throw new Error("حجم الملف أكبر من 10 MB");
  const allowed = folder === "images" ? MEDIA_IMAGE_TYPES : MEDIA_DOCUMENT_TYPES;
  if (!allowed.has(file.type)) throw new Error("نوع الملف غير مدعوم. استخدم صور JPG/PNG/WebP أو PDF أو فيديو MP4/WebM");
  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
    "image/gif": "gif", "application/pdf": "pdf",
    "video/mp4": "mp4", "video/webm": "webm",
  };
  const path = `${folder}/${crypto.randomUUID()}.${extensionByType[file.type]}`;
  const { error } = await supabase.storage.from(PUBLIC_MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`تعذر رفع الملف: ${error.message}`);
  const { data } = supabase.storage.from(PUBLIC_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function AdminActivityForm({ activity }: { activity?: ManagedActivity }) {
  const [error, setError] = useState("");
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    if (!title) return setError("يرجى إدخال اسم النشاط");
    if (!form.get("description") || !form.get("fullDescription") || !form.get("category") || !form.get("audience") || !form.get("duration")) return setError("يرجى إكمال الحقول المطلوبة");
    try {
      const imageFile = form.get("image");
      const image = imageFile instanceof File && imageFile.size
        ? await uploadPublicMedia(imageFile, "images")
        : activity?.image ?? photos.handwashing;
      const next: ManagedActivity = {
        id: activity?.id ?? `activity-${Date.now()}`,
        title,
        description: String(form.get("description") || ""),
        fullDescription: String(form.get("fullDescription") || ""),
        category: String(form.get("category") || ""),
        audience: String(form.get("audience") || ""),
        duration: String(form.get("duration") || ""),
        image,
        objectives: String(form.get("objectives") || ""),
        materials: String(form.get("materials") || ""),
        steps: String(form.get("steps") || ""),
        messages: String(form.get("messages") || ""),
        status: String(form.get("status") || "مسودة") as ManagedActivity["status"],
        createdAt: activity?.createdAt ?? new Date().toISOString().slice(0, 10),
      };
      await saveActivityToSupabase(next);
      queueAdminToast(activity ? "تم حفظ التعديلات" : "تمت إضافة النشاط بنجاح");
      window.location.hash = "#/admin/activities";
    } catch (error) {
      setError(`تعذر حفظ النشاط في Supabase: ${error instanceof Error ? error.message : "خطأ غير معروف"}`);
    }
  };
  return (
    <DashboardShell active="admin/activities" admin>
      <div className="dashboard-content narrow-dashboard"><a className="back-link" href="#/admin/activities"><Icon name="arrow" size={18} />العودة إلى الأنشطة</a><DashboardTitle title={activity ? "تعديل النشاط" : "نشاط جديد"} subtitle="أدخل المعلومات الأساسية، ويمكنك تعديلها لاحقًا." />
        <form className="admin-form" noValidate onSubmit={save}>
          {error && <p className="form-error span-two">{error}</p>}
          <label className="span-two">اسم النشاط<input defaultValue={activity?.title} name="title" placeholder="مثال: جلسة المياه الآمنة" required /></label>
          <label>وصف مختصر<textarea defaultValue={activity?.description} name="description" required rows={3}></textarea></label>
          <label>وصف كامل<textarea defaultValue={activity?.fullDescription} name="fullDescription" required rows={3}></textarea></label>
          <label>التصنيف<select defaultValue={activity?.category ?? ""} name="category" required><option value="" disabled>اختر التصنيف</option><option>النظافة الشخصية</option><option>المياه والصرف الصحي</option><option>القوارض والآفات</option><option>إدارة النفايات</option></select></label>
          <label>الفئة المستهدفة<input defaultValue={activity?.audience} name="audience" required /></label>
          <label>المدة<input defaultValue={activity?.duration} name="duration" required /></label>
          <label>صورة النشاط<input accept="image/*" name="image" type="file" /></label>
          <label>أهداف النشاط<textarea defaultValue={activity?.objectives} name="objectives" rows={3}></textarea></label>
          <label>المواد المطلوبة<textarea defaultValue={activity?.materials} name="materials" rows={3}></textarea></label>
          <label>خطوات التنفيذ<textarea defaultValue={activity?.steps} name="steps" rows={3}></textarea></label>
          <label>رسائل التوعية الرئيسية<textarea defaultValue={activity?.messages} name="messages" rows={3}></textarea></label>
          <label>حالة النشر<select defaultValue={activity?.status ?? "مسودة"} name="status"><option>مسودة</option><option>منشور</option></select></label>
          <div className="form-actions span-two"><a className="button button-outline" href="#/admin/activities">إلغاء</a><button className="button button-orange" type="submit">حفظ</button></div>
        </form>
      </div>
    </DashboardShell>
  );
}

function AdminCoursesPage() {
  const [items] = useManagedCourses();
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<ManagedCourse | null>(null);
  const visible = items.filter((item) => matchesLocalizedText(item.title, query));
  return <DashboardShell active="admin/courses" admin><div className="dashboard-content">
    <DashboardTitle title="إدارة الدورات" subtitle="إدارة محتوى الدورات والوحدات والدروس دون التأثير في تقدم المستخدمين." action={<a className="button button-orange" href="#/admin/courses/new">+ إضافة دورة جديدة</a>} />
    <div className="admin-management-tools"><SearchField placeholder="ابحث عن دورة..." value={query} onChange={setQuery} /></div>
    <div className="table-wrap"><table><thead><tr>{["اسم الدورة", "التصنيف", "المستوى", "المدة", "الوحدات", "الحالة", "الإجراءات"].map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{visible.map((item) => <tr key={item.id}><td><strong>{item.title}</strong></td><td>{item.category}</td><td>{item.level}</td><td>{item.duration}</td><td>{item.modules.length}</td><td><span className={`status-badge status-${item.status}`}>{item.status}</span></td><td className="event-actions"><a href="#/course/rodent-basics">عرض</a><a href={`#/admin/courses/edit/${item.id}`}>تعديل</a><button className="delete-action" onClick={() => setDeleting(item)} type="button">حذف</button></td></tr>)}</tbody></table></div>
    {deleting && <ConfirmDialog message="هل أنت متأكد من حذف هذه الدورة؟" onCancel={() => setDeleting(null)} onConfirm={() => { const id = deleting.id; setDeleting(null); void deleteCourseFromSupabase(id).then(() => queueAdminToast("تم حذف الدورة بنجاح")).catch((error) => { console.error(error); window.alert("تعذر حذف الدورة: " + (error instanceof Error ? error.message : String(error))); }); }} />}
  </div></DashboardShell>;
}

function AdminCourseForm({ course }: { course?: ManagedCourse }) {
  const [modules, setModules] = useState<CourseModule[]>(course?.modules ?? []);
  const [error, setError] = useState("");
  const updateModule = (id: string, update: Partial<CourseModule>) => setModules((current) => current.map((module) => module.id === id ? { ...module, ...update } : module));
  const moveModule = (index: number, direction: number) => setModules((current) => {
    const target = index + direction;
    if (target < 0 || target >= current.length) return current;
    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    if (!title) return setError("يرجى إدخال اسم الدورة");
    if (!form.get("description") || !form.get("category") || !form.get("duration")) return setError("يرجى إكمال الحقول المطلوبة");
    try {
      const imageFile = form.get("image");
      const image = imageFile instanceof File && imageFile.size ? await uploadPublicMedia(imageFile, "images") : course?.image ?? photos.training;
      const next: ManagedCourse = {
        id: course?.id ?? `course-${Date.now()}`,
        title,
        description: String(form.get("description") || ""),
        category: String(form.get("category") || ""),
        level: String(form.get("level") || ""),
        duration: String(form.get("duration") || ""),
        image,
        audience: String(form.get("audience") || ""),
        learning: String(form.get("learning") || ""),
        status: String(form.get("status") || "مسودة") as ManagedCourse["status"],
        progress: course?.progress ?? 0,
        modules,
      };
      await saveCourseToSupabase(next);
      queueAdminToast(course ? "تم حفظ التعديلات" : "تمت إضافة الدورة بنجاح");
      window.location.hash = "#/admin/courses";
    } catch (error) { console.error(error); setError("تعذر حفظ الدورة: " + (error instanceof Error ? error.message : String(error))); }
  };
  return <DashboardShell active="admin/courses" admin><div className="dashboard-content narrow-dashboard">
    <a className="back-link" href="#/admin/courses"><Icon name="arrow" size={18} />العودة إلى الدورات</a>
    <DashboardTitle title={course ? "تعديل الدورة" : "دورة جديدة"} subtitle="أدخل بيانات الدورة ونظّم وحداتها ودروسها." />
    <form className="admin-form" noValidate onSubmit={save}>
      {error && <p className="form-error span-two">{error}</p>}
      <label className="span-two">اسم الدورة<input defaultValue={course?.title} name="title" required /></label>
      <label className="span-two">الوصف<textarea defaultValue={course?.description} name="description" rows={4} required /></label>
      <label>التصنيف<input defaultValue={course?.category} name="category" required /></label>
      <label>المستوى<select defaultValue={course?.level ?? "مبتدئ"} name="level"><option>مبتدئ</option><option>متوسط</option><option>متقدم</option></select></label>
      <label>المدة<input defaultValue={course?.duration} name="duration" required /></label>
      <label>صورة الغلاف<input accept="image/*" name="image" type="file" /></label>
      <label>الفئة المستهدفة<input defaultValue={course?.audience} name="audience" /></label>
      <label>ماذا ستتعلم؟<textarea defaultValue={course?.learning} name="learning" rows={3}></textarea></label>
      <label>حالة النشر<select defaultValue={course?.status ?? "مسودة"} name="status"><option>مسودة</option><option>منشور</option></select></label>
      <div className="course-module-editor span-two">
        <div className="form-title"><h2>الوحدات والدروس</h2><button onClick={() => setModules((current) => [...current, { id: `module-${Date.now()}`, title: "وحدة جديدة", lessons: [] }])} type="button">+ إضافة وحدة</button></div>
        {modules.map((module, index) => <div className="module-editor" key={module.id}>
          <div className="module-editor-title"><input aria-label="اسم الوحدة" onChange={(e) => updateModule(module.id, { title: e.target.value })} value={module.title} /><div><button onClick={() => moveModule(index, -1)} type="button">أعلى</button><button onClick={() => moveModule(index, 1)} type="button">أسفل</button><button className="delete-action" onClick={() => setModules((current) => current.filter((item) => item.id !== module.id))} type="button">حذف</button></div></div>
          {module.lessons.map((lesson) => <div className="lesson-editor" key={lesson.id}><input aria-label="اسم الدرس" onChange={(e) => updateModule(module.id, { lessons: module.lessons.map((item) => item.id === lesson.id ? { ...item, title: e.target.value } : item) })} value={lesson.title} /><button onClick={() => updateModule(module.id, { lessons: module.lessons.filter((item) => item.id !== lesson.id) })} type="button">حذف</button></div>)}
          <button className="add-lesson" onClick={() => updateModule(module.id, { lessons: [...module.lessons, { id: `lesson-${Date.now()}`, title: "درس جديد" }] })} type="button">+ إضافة درس</button>
        </div>)}
      </div>
      <div className="form-actions span-two"><a className="button button-outline" href="#/admin/courses">إلغاء</a><button className="button button-orange" type="submit">حفظ</button></div>
    </form>
  </div></DashboardShell>;
}

function AdminLibraryPage() {
  const [items] = useManagedResources();
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<ManagedResource | null>(null);
  const visible = items.filter((item) => matchesLocalizedText(item.title, query));
  return <DashboardShell active="admin/library" admin><div className="dashboard-content">
    <DashboardTitle title="إدارة المكتبة" subtitle="نظّم المواد التوعوية وحدّث حالة نشرها." action={<a className="button button-orange" href="#/admin/library/new">+ إضافة مادة توعوية</a>} />
    <div className="admin-management-tools"><SearchField placeholder="ابحث عن مادة..." value={query} onChange={setQuery} /></div>
    <div className="table-wrap"><table><thead><tr>{["عنوان المادة", "النوع", "الموضوع", "الحالة", "الإجراءات"].map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{visible.map((item) => <tr key={item.id}><td><strong>{item.title}</strong></td><td>{item.type}</td><td>{item.topic}</td><td><span className={`status-badge status-${item.status}`}>{item.status}</span></td><td className="event-actions"><a href={item.fileUrl}>معاينة</a><a href={`#/admin/library/edit/${item.id}`}>تعديل</a><button className="delete-action" onClick={() => setDeleting(item)} type="button">حذف</button></td></tr>)}</tbody></table></div>
    {deleting && <ConfirmDialog message="هل أنت متأكد من حذف هذه المادة؟" onCancel={() => setDeleting(null)} onConfirm={() => { const id = deleting.id; setDeleting(null); void deleteResourceFromSupabase(id).then(() => queueAdminToast("تم حذف المادة بنجاح")).catch((error) => { console.error(error); window.alert("تعذر حذف المادة: " + (error instanceof Error ? error.message : String(error))); }); }} />}
  </div></DashboardShell>;
}

function AdminResourceForm({ resource }: { resource?: ManagedResource }) {
  const [error, setError] = useState("");
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    if (!title) return setError("يرجى إدخال عنوان المادة");
    if (!form.get("description") || !form.get("topic")) return setError("يرجى إكمال الحقول المطلوبة");
    try {
      const imageFile = form.get("image");
      const materialFile = form.get("file");
      const image = imageFile instanceof File && imageFile.size ? await uploadPublicMedia(imageFile, "images") : resource?.image ?? photos.handwashing;
      const fileUrl = materialFile instanceof File && materialFile.size ? await uploadPublicMedia(materialFile, "materials") : String(form.get("videoUrl") || resource?.fileUrl || "#/resource/rodent-guide");
      const next: ManagedResource = { id: resource?.id ?? `resource-${Date.now()}`, title, description: String(form.get("description") || ""), topic: String(form.get("topic") || ""), type: String(form.get("type") || "PDF"), image, fileUrl, status: String(form.get("status") || "مسودة") as ManagedResource["status"] };
      await saveResourceToSupabase(next);
      queueAdminToast(resource ? "تم حفظ التعديلات" : "تمت إضافة المادة بنجاح");
      window.location.hash = "#/admin/library";
    } catch (error) { setError("تعذر حفظ المادة: " + (error instanceof Error ? error.message : String(error))); }
  };
  return <DashboardShell active="admin/library" admin><div className="dashboard-content narrow-dashboard">
    <a className="back-link" href="#/admin/library"><Icon name="arrow" size={18} />العودة إلى المكتبة</a>
    <DashboardTitle title={resource ? "تعديل المادة" : "مادة توعوية جديدة"} subtitle="أدخل معلومات المادة وحالة نشرها." />
    <form className="admin-form" noValidate onSubmit={save}>
      {error && <p className="form-error span-two">{error}</p>}
      <label className="span-two">عنوان المادة<input defaultValue={resource?.title} name="title" required /></label>
      <label className="span-two">الوصف<textarea defaultValue={resource?.description} name="description" rows={4} required /></label>
      <label>الموضوع<input defaultValue={resource?.topic} name="topic" required /></label>
      <label>نوع المادة<select defaultValue={resource?.type ?? "PDF"} name="type">{["PDF", "ملصق", "فيديو", "مطوية", "دليل", "صورة"].map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>صورة الغلاف<input accept="image/*" name="image" type="file" /></label>
      <label>ملف المادة<input name="file" type="file" /></label>
      <label className="span-two">رابط الفيديو<input defaultValue={resource?.fileUrl.startsWith("http") ? resource.fileUrl : ""} name="videoUrl" type="url" /></label>
      <label>حالة النشر<select defaultValue={resource?.status ?? "مسودة"} name="status"><option>مسودة</option><option>منشور</option></select></label>
      <div className="form-actions span-two"><a className="button button-outline" href="#/admin/library">إلغاء</a><button className="button button-orange" type="submit">حفظ</button></div>
    </form>
  </div></DashboardShell>;
}

type ManagedUser = { id: string; email: string; name: string; role: "manager" | "assistant_manager" | "employee"; created_at: string; banned: boolean };
const roleLabels: Record<ManagedUser["role"], string> = { manager: "مدير", assistant_manager: "مساعد مدير", employee: "موظف" };

type InternalMessage = { id: string; sender_id: string; recipient_id: string; subject: string; body: string; is_read: boolean; created_at: string };
type MessageRecipient = { user_id: string; display_name: string; email: string; role: string };

function AdminMessagesPage() {
  const [myId, setMyId] = useState("");
  const [myRole, setMyRole] = useState("");
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [recipients, setRecipients] = useState<MessageRecipient[]>([]);
  const [folder, setFolder] = useState<"inbox" | "sent">("inbox");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const load = async () => {
    if (!supabase) { setError("يرجى إعداد Supabase أولًا"); setLoading(false); return; }
    setLoading(true);
    const { data: userData, error: authError } = await supabase.auth.getUser();
    const user = userData.user;
    if (authError || !user) { setError("يرجى تسجيل الدخول أولًا"); setLoading(false); return; }
    setMyId(user.id);
    const [roleResult, messagesResult, peopleResult] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
      supabase.from("internal_messages").select("id,sender_id,recipient_id,subject,body,is_read,created_at").order("created_at", { ascending: false }).limit(200),
      supabase.rpc("message_recipients"),
    ]);
    setMyRole(roleResult.data?.role ?? "");
    if (messagesResult.error) setError("تعذر تحميل الرسائل: " + messagesResult.error.message);
    else { setMessages((messagesResult.data ?? []) as InternalMessage[]); setError(""); }
    if (peopleResult.error) setError(current => [current, "تعذر تحميل المستلمين: " + peopleResult.error.message + " — نفّذي ملف SQL المرفق."].filter(Boolean).join(" | "));
    else setRecipients((peopleResult.data ?? []) as MessageRecipient[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);
  const send = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !myId || busy) return;
    if (!recipient || !subject.trim() || !body.trim()) { setError("يرجى تعبئة جميع الحقول"); return; }
    setBusy(true); setError(""); setNotice("");
    const { error: sendError } = await supabase.from("internal_messages").insert({ sender_id: myId, recipient_id: recipient, subject: subject.trim(), body: body.trim() });
    if (sendError) setError("تعذر إرسال الرسالة: " + sendError.message);
    else { setNotice("تم إرسال الرسالة بنجاح"); setSubject(""); setBody(""); setRecipient(""); setFolder("sent"); await load(); }
    setBusy(false);
  };
  const openMessage = async (item: InternalMessage) => {
    setSelected(selected === item.id ? null : item.id);
    if (!supabase || item.recipient_id !== myId || item.is_read) return;
    const { error: readError } = await supabase.from("internal_messages").update({ is_read: true }).eq("id", item.id).eq("recipient_id", myId);
    if (readError) setError("تعذر تحديث حالة القراءة: " + readError.message);
    else setMessages(current => current.map(m => m.id === item.id ? { ...m, is_read: true } : m));
  };
  const peopleName = (id: string) => recipients.find(p => p.user_id === id)?.display_name || recipients.find(p => p.user_id === id)?.email || (id === myId ? "أنا" : "مستخدم");
  const visible = messages.filter(m => folder === "inbox" ? m.recipient_id === myId : m.sender_id === myId);
  const allowed = myRole === "manager" || myRole === "assistant_manager";
  return <DashboardShell active="admin/messages" admin><div className="dashboard-content">
    <DashboardTitle title="المراسلات الداخلية" subtitle="رسائل خاصة بين المدير ومساعد المدير، محفوظة في Supabase." action={<button type="button" className="button button-outline" onClick={() => void load()}>تحديث الرسائل</button>} />
    {error && <p className="form-error" role="alert">{error}</p>}
    {notice && <p role="status" className="message-success">{notice}</p>}
    {loading ? <p>جارٍ تحميل المراسلات...</p> : !allowed ? <p role="alert">المراسلات متاحة للمدير ومساعد المدير فقط.</p> : <div className="internal-messages-layout">
      <section className="internal-message-panel">
        <h2>رسالة جديدة</h2>
        <form onSubmit={send} className="internal-message-form">
          <label>إلى<select value={recipient} onChange={e => setRecipient(e.target.value)} required><option value="">اختاري المستلم</option>{recipients.filter(p => p.user_id !== myId).map(p => <option key={p.user_id} value={p.user_id}>{p.display_name || p.email} — {p.role === "manager" ? "مدير" : "مساعد مدير"}</option>)}</select></label>
          <label>الموضوع<input value={subject} onChange={e => setSubject(e.target.value)} maxLength={200} required placeholder="موضوع الرسالة" /></label>
          <label>نص الرسالة<textarea value={body} onChange={e => setBody(e.target.value)} rows={6} required placeholder="اكتبي الرسالة هنا..." /></label>
          <button className="button button-orange" disabled={busy || !recipients.some(p => p.user_id !== myId)} type="submit">{busy ? "جارٍ الإرسال..." : "إرسال الرسالة"}</button>
        </form>
      </section>
      <section className="internal-message-panel">
        <div className="internal-message-tabs"><button type="button" className={folder === "inbox" ? "active" : ""} onClick={() => { setFolder("inbox"); setSelected(null); }}>الوارد ({messages.filter(m => m.recipient_id === myId).length})</button><button type="button" className={folder === "sent" ? "active" : ""} onClick={() => { setFolder("sent"); setSelected(null); }}>المرسل ({messages.filter(m => m.sender_id === myId).length})</button></div>
        {visible.length === 0 ? <p className="internal-message-empty">لا توجد رسائل في هذا القسم حاليًا.</p> : <div className="internal-message-list">{visible.map(item => <article key={item.id} className={`internal-message-item ${!item.is_read && folder === "inbox" ? "unread" : ""}`}><button type="button" onClick={() => void openMessage(item)} aria-expanded={selected === item.id}><strong>{item.subject}</strong><span>{folder === "inbox" ? "من: " + peopleName(item.sender_id) : "إلى: " + peopleName(item.recipient_id)}</span><small>{new Date(item.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</small></button>{selected === item.id && <div className="internal-message-body">{item.body}</div>}</article>)}</div>}
      </section>
    </div>}
  </div></DashboardShell>;
}

function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [newRole, setNewRole] = useState<ManagedUser["role"]>("employee");
  const [myRole, setMyRole] = useState("");
  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const [{ data, error: listError }, { data: userData }] = await Promise.all([
      supabase.rpc("admin_list_users"), supabase.auth.getUser(),
    ]);
    if (listError) setError("تعذر تحميل المستخدمين: " + listError.message + " — تأكد من تنفيذ ملف SQL المرفق.");
    else { setUsers((data ?? []) as ManagedUser[]); setError(""); }
    if (userData.user) {
      const { data: ownRole } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id).maybeSingle();
      setMyRole(ownRole?.role ?? "");
    }
    setLoading(false);
  };
  useEffect(() => { void refresh(); }, []);
  const action = async (operation: string, payload: Record<string, unknown>) => {
    if (!supabase) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const { data, error: invokeError } = await supabase.functions.invoke("manage-users", { body: { operation, ...payload } });
      if (invokeError) {
        const context = (invokeError as { context?: Response }).context;
        let details = invokeError.message;
        if (context && typeof context.json === "function") { try { const json = await context.json(); details = json.error ?? details; } catch { /* non-JSON response */ } }
        throw new Error(details);
      }
      if (data?.error) throw new Error(data.error);
      setMessage(operation === "invite" ? "تم إرسال دعوة للبريد الإلكتروني." : "تم حفظ التغيير.");
      if (operation === "invite") { setEmail(""); setName(""); }
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع"); }
    finally { setBusy(false); }
  };
  const visible = users.filter(u => `${u.email} ${u.name}`.toLowerCase().includes(query.toLowerCase()));
  return <DashboardShell active="admin/users" admin><div className="dashboard-content">
    <DashboardTitle title="إدارة المستخدمين" subtitle="حسابات حقيقية من Supabase، وليست بيانات تجريبية." />
    {myRole !== "manager" && !loading ? <p role="alert">إدارة الحسابات متاحة للمدير فقط.</p> : <>
      <form className="settings-form" onSubmit={e => { e.preventDefault(); void action("invite", { email, name, role: newRole }); }}>
        <h3>دعوة مستخدم جديد</h3>
        <p>سيصل للمستخدم بريد دعوة لإعداد حسابه. لا نطلب كلمة مروره.</p>
        <label>الاسم<input required value={name} onChange={e => setName(e.target.value)} /></label>
        <label>البريد الإلكتروني<input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>الصلاحية<select value={newRole} onChange={e => setNewRole(e.target.value as ManagedUser["role"])}><option value="employee">موظف</option><option value="assistant_manager">مساعد مدير</option><option value="manager">مدير</option></select></label>
        <button className="button button-orange" disabled={busy || loading || myRole !== "manager"} type="submit">إرسال دعوة</button>
      </form>
      <div className="admin-management-tools"><SearchField placeholder="ابحث بالاسم أو البريد..." value={query} onChange={setQuery} /><button className="button button-outline" onClick={() => void refresh()} type="button">تحديث القائمة</button></div>
      {loading && <p role="status">جارٍ تحميل الحسابات...</p>}
      {error && <p role="alert" style={{ color: "#a12828" }}>{error}</p>}
      {message && <p role="status" style={{ color: "#54652e" }}>{message}</p>}
      <div className="table-wrap"><table><thead><tr>{["الاسم", "البريد الإلكتروني", "الدور", "الحالة", "تاريخ الإنشاء", "الإجراءات"].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{visible.map(u => <tr key={u.id}>
        <td>{u.name || "—"}</td><td>{u.email}</td>
        <td><select aria-label={`صلاحية ${u.email}`} disabled={busy || myRole !== "manager"} value={u.role} onChange={e => { if (window.confirm("هل تريد تغيير صلاحية هذا المستخدم؟")) void action("set_role", { user_id: u.id, role: e.target.value }); }}><option value="employee">موظف</option><option value="assistant_manager">مساعد مدير</option><option value="manager">مدير</option></select></td>
        <td>{u.banned ? "معطل" : "نشط"}</td><td>{u.created_at ? new Date(u.created_at).toLocaleDateString("en-GB") : "—"}</td>
        <td><button disabled={busy || myRole !== "manager"} type="button" onClick={() => { if (window.confirm(u.banned ? "تفعيل هذا الحساب؟" : "تعطيل هذا الحساب؟")) void action("set_disabled", { user_id: u.id, disabled: !u.banned }); }}>{u.banned ? "تفعيل" : "تعطيل"}</button></td>
      </tr>)}</tbody></table></div>
      {!loading && visible.length === 0 && !error && <p>لا توجد حسابات مطابقة.</p>}
    </>}
  </div></DashboardShell>;
}

function AdminReportsPage() {
  const [activities] = useManagedActivities();
  const [managedCourses] = useManagedCourses();
  const [managedResources] = useManagedResources();
  const [managedEvents] = useManagedEvents();
  const [preview, setPreview] = useState("تقرير مؤشرات المنصة");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("جميع التصنيفات");
  const [activityType, setActivityType] = useState("جميع الأنواع");
  const filteredActivities = activities.filter((item) =>
    (!date || item.createdAt >= date) &&
    (category === "جميع التصنيفات" || item.category === category) &&
    (activityType === "جميع الأنواع" || (activityType === "جلسة توعوية" ? item.duration.includes("٣٠") : !item.duration.includes("٣٠"))),
  );
  return <DashboardShell active="admin/reports" admin><div className="dashboard-content admin-report-page">
    <DashboardTitle title="التقارير" subtitle="راجع مؤشرات المنصة واعرض نسخة قابلة للطباعة." action={<button className="button button-orange" onClick={() => window.print()} type="button">طباعة التقرير / حفظ PDF</button>} />
    <div className="report-filters"><label>التاريخ<input onChange={(event) => setDate(event.target.value)} type="date" value={date} /></label><label>التصنيف<select onChange={(event) => setCategory(event.target.value)} value={category}><option>جميع التصنيفات</option><option>النظافة الشخصية</option><option>القوارض والآفات</option><option>إدارة النفايات</option></select></label><label>نوع النشاط<select onChange={(event) => setActivityType(event.target.value)} value={activityType}><option>جميع الأنواع</option><option>جلسة توعوية</option><option>نشاط ميداني</option></select></label></div>
    <KpiGrid items={[["عدد الأنشطة", String(filteredActivities.length)], ["عدد المستفيدين", "٧٩٬٢٤٨"], ["عدد الجلسات", "٣٬٠٨٣"], ["عدد الدورات", String(managedCourses.length)], ["المواد التوعوية", String(managedResources.length)], ["تقدم التدريب", "٧٩٪"]]} />
    <div className="admin-charts"><ChartCard title="الأنشطة حسب التصنيف" /><ChartCard title="المستفيدون حسب الفئة" type="donut" /></div>
    <section className="printable-report"><div className="section-title-row"><h2>{preview}</h2></div><p>يعرض هذا التقرير ملخصًا واقعيًا للمؤشرات والأنشطة والحملات خلال الفترة المحددة.</p><DataTable headers={["المؤشر", "القيمة", "الحالة"]} rows={[["الحملات والفعاليات", String(managedEvents.length), "محدّث"], ["الدورات المنشورة", String(managedCourses.filter((item) => item.status === "منشور").length), "محدّث"], ["المواد المنشورة", String(managedResources.filter((item) => item.status === "منشور").length), "محدّث"]]} /></section>
    <div className="report-grid">{["تقرير الأنشطة", "تقرير المستفيدين", "تقرير تقدم التدريب"].map((title) => <article className="report-card" key={title}><span className="large-icon"><Icon name="book" /></span><h3>{title}</h3><p>ملخص منظم للبيانات والنتائج خلال الفترة المحددة.</p><div><button onClick={() => setPreview(title)} type="button">عرض التقرير</button><button onClick={() => window.print()} type="button">طباعة / PDF</button></div></article>)}</div>
  </div></DashboardShell>;
}

function AdminSettingsPage() {
  const settings = usePlatformSettings();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isManager, setIsManager] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    const check = async () => {
      if (!supabase) { if (active) setIsManager(false); return; }
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { if (active) setIsManager(false); return; }
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", auth.user.id).maybeSingle();
      if (active) setIsManager(!error && data?.role === "manager");
    };
    void check();
    return () => { active = false; };
  }, []);
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isManager !== true) { setSaveError("تعديل الإحصائيات والإعدادات متاح للمدير الرئيسي فقط"); return; }
    const form = new FormData(event.currentTarget);
    const readCount = (name: string) => {
      const value = Number(form.get(name));
      if (!Number.isSafeInteger(value) || value < 0) throw new Error("أدخل أرقامًا صحيحة وغير سالبة للإحصائيات");
      return value;
    };
    const readOptionalCount = (name: string): number | null => {
      const raw = form.get(name);
      if (raw === null || String(raw).trim() === "") return null;
      const value = Number(raw);
      if (!Number.isSafeInteger(value) || value < 0) throw new Error("أدخل أرقامًا صحيحة وغير سالبة للمستهدف والمتحقق");
      return value;
    };
    let counts: Pick<PlatformSettings, "goalTarget" | "goalAchieved" | "impactSessions" | "impactBeneficiaries" | "impactResources" | "impactCourses" | "chartMonthly" | "chartFamilies" | "chartChildren" | "chartFieldTeams">;
    try {
      counts = {
        goalTarget: readOptionalCount("goalTarget"),
        goalAchieved: readOptionalCount("goalAchieved"),
        impactSessions: readCount("impactSessions"),
        impactBeneficiaries: readCount("impactBeneficiaries"),
        impactResources: readCount("impactResources"),
        impactCourses: readCount("impactCourses"),
        chartMonthly: Array.from({ length: 6 }, (_, index) => readCount(`chartMonth${index}`)),
        chartFamilies: readCount("chartFamilies"),
        chartChildren: readCount("chartChildren"),
        chartFieldTeams: readCount("chartFieldTeams"),
      };
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "أرقام غير صالحة");
      return;
    }
    const updated: PlatformSettings = {
      ...counts,
      name: String(form.get("name") || ""),
      description: String(form.get("description") || ""),
      contact: String(form.get("contact") || ""),
      homeActivities: form.get("homeActivities") === "on",
      homeKnowledge: form.get("homeKnowledge") === "on",
      homeEvents: form.get("homeEvents") === "on",
      notifications: form.get("notifications") === "on",
    };
    setSaving(true);
    setSaveError("");
    try {
      await savePlatformSettings(updated);
      queueAdminToast("تم حفظ التعديلات في Supabase");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };
  return <DashboardShell active="admin/settings" admin><div className="dashboard-content narrow-dashboard">
    <DashboardTitle title="إعدادات المنصة" subtitle="حدّث البيانات العامة وخيارات العرض والإشعارات بأمان." />
    {isManager === null ? <p>جارٍ التحقق من صلاحية المدير...</p> : isManager === false ? <p role="alert">إدارة الإعدادات والإحصائيات متاحة للمدير الرئيسي فقط.</p> : <form className="admin-form" key={JSON.stringify(settings)} onSubmit={save}>
      <div className="form-title span-two"><h2>إعدادات المنصة</h2></div>
      <label>اسم المنصة<input defaultValue={settings.name} name="name" required /></label>
      <label>بيانات التواصل<input defaultValue={settings.contact} name="contact" required /></label>
      <label className="span-two">وصف المنصة<textarea defaultValue={settings.description} name="description" rows={3}></textarea></label>
      <div className="form-title span-two"><h2>إحصائيات الصفحة الرئيسية</h2><p>أدخل الأرقام الرسمية المعتمدة. لا تظهر أرقام تجريبية تلقائيًا.</p></div>
      <label>عدد الجلسات التوعوية<input type="number" min="0" step="1" name="impactSessions" defaultValue={settings.impactSessions} required /></label>
      <label>عدد المستفيدين<input type="number" min="0" step="1" name="impactBeneficiaries" defaultValue={settings.impactBeneficiaries} required /></label>
      <label>عدد المواد التوعوية<input type="number" min="0" step="1" name="impactResources" defaultValue={settings.impactResources} required /></label>
      <label>عدد الدورات التدريبية<input type="number" min="0" step="1" name="impactCourses" defaultValue={settings.impactCourses} required /></label>
      <div className="form-title span-two"><h2>بيانات الرسوم البيانية</h2><p>الأرقام الرسمية فقط. الأشهر المعروضة: مايو إلى أكتوبر. جميع القيم محفوظة في Supabase.</p></div>
      {["مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر"].map((month, index) => <label key={month}>أنشطة {month}<input type="number" min="0" step="1" name={`chartMonth${index}`} defaultValue={(settings.chartMonthly ?? defaultPlatformSettings.chartMonthly)[index] ?? 0} required /></label>)}
      <div className="form-title span-two"><h2>توزيع المستفيدين</h2><p>أدخل العدد لكل فئة، وسيتم حساب النسب تلقائيًا.</p></div>
      <label>عدد الأسر<input type="number" min="0" step="1" name="chartFamilies" defaultValue={settings.chartFamilies ?? 0} required /></label>
      <label>عدد الأطفال<input type="number" min="0" step="1" name="chartChildren" defaultValue={settings.chartChildren ?? 0} required /></label>
      <label>عدد الفرق الميدانية<input type="number" min="0" step="1" name="chartFieldTeams" defaultValue={settings.chartFieldTeams ?? 0} required /></label>
      <div className="form-title span-two"><h2>المستهدف مقابل المتحقق</h2><p>أدخل القيم الرسمية للمؤشر نفسه وبنفس وحدة القياس. اترك الخانتين فارغتين إذا لم تتوفر البيانات بعد؛ ستظهر تلقائيًا في صفحة المتابعة والتقييم.</p></div>
      <label>العدد المستهدف<input type="number" min="0" step="1" name="goalTarget" defaultValue={settings.goalTarget ?? ""} placeholder="لم يُحدد بعد" /></label>
      <label>العدد المتحقق<input type="number" min="0" step="1" name="goalAchieved" defaultValue={settings.goalAchieved ?? ""} placeholder="لم يُسجل بعد" /></label>
      <div className="form-title span-two"><h2>إعدادات الصفحة الرئيسية</h2></div>
      <label className="homepage-toggle"><span>إظهار قسم الأنشطة</span><input defaultChecked={settings.homeActivities} name="homeActivities" type="checkbox" /></label>
      <label className="homepage-toggle"><span>إظهار قسم المعرفة</span><input defaultChecked={settings.homeKnowledge} name="homeKnowledge" type="checkbox" /></label>
      <label className="homepage-toggle"><span>إظهار المناسبات</span><input defaultChecked={settings.homeEvents} name="homeEvents" type="checkbox" /></label>
      <label className="homepage-toggle"><span>إشعارات الإدارة</span><input defaultChecked={settings.notifications} name="notifications" type="checkbox" /></label>
      {saveError && <p className="span-two" role="alert" style={{ color: "#b42318" }}>{saveError}</p>}
      <div className="form-actions span-two"><button className="button button-orange" disabled={saving} type="submit">{saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}</button></div>
    </form>}
  </div></DashboardShell>;
}

function ReportsPage() {
  return (
    <PublicPage>
      <section className="inner-page container">
        <PageIntro title="التقارير" subtitle="تقارير واضحة تساعدك على متابعة الأنشطة والنتائج." />
        <div className="report-filters"><label>الفترة<select><option>آخر ٣ أشهر</option><option>هذا العام</option></select></label><label>الموقع<select><option>جميع المواقع</option><option>المركز المجتمعي</option></select></label><label>المجال<select><option>جميع المجالات</option><option>النظافة الشخصية</option><option>القوارض والآفات</option></select></label></div>
        <div className="report-grid">{["تقرير الأنشطة", "تقرير المستفيدين", "تقرير التدريبات", "تقرير القوارض والآفات", "تقرير الحملات"].map((title) => <article className="report-card" key={title}><span className="large-icon"><Icon name="book" /></span><h3>{title}</h3><p>ملخص منظم للبيانات والنتائج خلال الفترة المحددة.</p><div><button type="button">عرض التقرير</button><button type="button">تصدير PDF</button></div></article>)}</div>
      </section>
    </PublicPage>
  );
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) { setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local"); return; }
    setBusy(true); setError("");
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw loginError;
      const { data: roleData, error: roleError } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).maybeSingle();
      if (roleError) throw roleError;
      window.location.hash = roleData?.role === "manager" || roleData?.role === "assistant_manager" ? "#/admin" : "#/user";
    } catch (err) { setError(err instanceof Error ? err.message : "تعذر تسجيل الدخول"); }
    finally { setBusy(false); }
  };
  return (
    <div className="login-page">
      <div className="login-logo"><Logo /></div>
      <div className="login-language-switch"><LanguageSwitch /></div>
      <div className="login-form-side">
        <form className="login-form" onSubmit={submit}>
          <div className="eyebrow">مساحتك الخاصة</div><h1>مرحبًا بعودتك</h1><p>سجّل دخولك لمتابعة الدورات والأنشطة المحفوظة.</p>
          <label>البريد الإلكتروني<input autoComplete="username" placeholder="name@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
          <label>كلمة المرور<input autoComplete="current-password" placeholder="أدخل كلمة المرور" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
          {error && <p role="alert" style={{color:"#a42c27"}}>{error}</p>}
          {!supabaseConfigured && <p role="alert">يرجى إعداد الاتصال بـ Supabase أولًا.</p>}
          <button className="button button-orange" type="submit" disabled={busy || !supabaseConfigured}>{busy ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}</button>
          <a href="#/forgot-password" style={{ display: "inline-block", marginTop: 12, color: "#54652e", textDecoration: "underline" }}>نسيت كلمة المرور؟</a>
          <p>الحسابات تُنشأ بواسطة مسؤول النظام فقط.</p>
        </form>
      </div>
      <div className="login-image-side"><img src={photos.cleanup} alt="أطفال يشاركون في نشاط للنظافة البيئية في مجتمع نازح" /><div><span>معًا نصنع أثرًا</span><h2>المعرفة والمشاركة طريقنا إلى مجتمع أكثر صحة.</h2></div></div>
    </div>
  );
}

// The recovery redirect uses a query parameter because this app uses hash-based routing.
// Supabase must be allowed to consume the auth tokens in the URL fragment first.
function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) { setError("الاتصال بـ Supabase غير مهيأ."); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}?password_recovery=1`;
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (recoveryError) throw recoveryError;
      setMessage("إذا كان البريد مسجلًا، ستصلك رسالة لإعادة تعيين كلمة المرور. افتحي الرابط من نفس الجهاز الذي يعمل عليه الموقع.");
    } catch (err) { setError(err instanceof Error ? err.message : "تعذّر إرسال رسالة الاستعادة."); }
    finally { setBusy(false); }
  };
  return (
    <div className="login-page" dir="rtl">
      <div className="login-logo"><Logo /></div>
      <div className="login-language-switch"><LanguageSwitch /></div>
      <div className="login-form-side">
        <form className="login-form" onSubmit={submit}>
          <div className="eyebrow">استعادة الحساب</div>
          <h1>نسيت كلمة المرور؟</h1>
          <p>أدخلي البريد الإلكتروني للحساب، وسنرسل رابطًا لتعيين كلمة مرور جديدة.</p>
          <label>البريد الإلكتروني<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
          {error && <p role="alert" style={{ color: "#a42c27" }}>{error}</p>}
          {message && <p role="status" style={{ color: "#54652e" }}>{message}</p>}
          <button className="button button-orange" type="submit" disabled={busy || !supabaseConfigured}>{busy ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}</button>
          <p><a href="#/login">العودة إلى تسجيل الدخول</a></p>
        </form>
      </div>
      <div className="login-image-side"><img src={photos.cleanup} alt="نشاط مجتمعي" /></div>
    </div>
  );
}

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!supabase) { setError("الاتصال بـ Supabase غير مهيأ."); return; }
    let alive = true;
    const client = supabase;
    const check = async () => {
      const { data, error: sessionError } = await client.auth.getSession();
      if (!alive) return;
      if (sessionError || !data.session) setError("رابط الاستعادة غير صالح أو انتهت صلاحيته. اطلبي رابطًا جديدًا.");
      else { setReady(true); setError(""); }
    };
    void check();
    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
      if (!alive) return;
      if (event === "PASSWORD_RECOVERY" && session) { setReady(true); setError(""); }
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !ready) return;
    if (password.length < 8) { setError("اختاري كلمة مرور من 8 أحرف على الأقل."); return; }
    if (password !== confirmPassword) { setError("كلمتا المرور غير متطابقتين."); return; }
    setBusy(true); setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      // Clear recovery query parameters and keep the user on this page.
      window.history.replaceState(null, "", `${window.location.pathname}#/reset-password`);
    } catch (err) { setError(err instanceof Error ? err.message : "تعذّر تحديث كلمة المرور."); }
    finally { setBusy(false); }
  };

  return (
    <div className="login-page" dir="rtl">
      <div className="login-logo"><Logo /></div>
      <div className="login-language-switch"><LanguageSwitch /></div>
      <div className="login-form-side">
        <form className="login-form" onSubmit={submit}>
          <div className="eyebrow">حماية الحساب</div>
          <h1>تعيين كلمة مرور جديدة</h1>
          {success ? <><p role="status">تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.</p><a className="button button-orange" href="#/login">الذهاب لتسجيل الدخول</a></> : <>
            <p>اختاري كلمة مرور جديدة لحسابك.</p>
            <label>كلمة المرور الجديدة<input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required disabled={!ready || busy} /></label>
            <label>تأكيد كلمة المرور<input type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={8} required disabled={!ready || busy} /></label>
            {error && <p role="alert" style={{ color: "#a42c27" }}>{error} <a href="#/forgot-password">طلب رابط جديد</a></p>}
            <button className="button button-orange" type="submit" disabled={!ready || busy}>{busy ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}</button>
          </>}
        </form>
      </div>
      <div className="login-image-side"><img src={photos.cleanup} alt="نشاط مجتمعي" /></div>
    </div>
  );
}

function ProtectedRoute({ admin, children }: { admin: boolean; children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    let sequence = 0;
    const refresh = async (current: Session | null) => {
      const ticket = ++sequence;
      if (!alive) return;
      setLoading(true);
      setSession(current);
      if (!current || !supabase) { setRole(null); setLoading(false); return; }
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", current.user.id).maybeSingle();
      if (alive && ticket === sequence) { setRole(error ? null : data?.role ?? "employee"); setLoading(false); }
    };
    if (!supabase) { setLoading(false); return; }
    void supabase.auth.getSession().then(({data}) => refresh(data.session));
    const {data: listener} = supabase.auth.onAuthStateChange((_event, next) => { void refresh(next); });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);
  if (loading) return <div className="auth-state" role="status">جارٍ التحقق من الحساب...</div>;
  if (!session) return <div className="auth-state"><h2>يلزم تسجيل الدخول</h2><a className="button button-orange" href="#/login">تسجيل الدخول</a></div>;
  if (admin && role !== "manager" && role !== "assistant_manager") return <div className="auth-state"><h2>ليس لديك صلاحية الوصول للإدارة</h2><a href="#/user">لوحة المستخدم</a></div>;
  return <>{children}</>;
}

function SettingsPage() {
  const [tab, setTab] = useState("الملف الشخصي");
  return (
    <DashboardShell active="settings">
      <div className="dashboard-content narrow-dashboard"><DashboardTitle title="إعدادات الحساب" subtitle="حدّث معلوماتك وتفضيلات حسابك." /><div className="settings-shell"><div className="settings-tabs">{["الملف الشخصي", "كلمة المرور", "الإشعارات"].map((item) => <button className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)} type="button">{item}</button>)}</div>
        {tab === "الملف الشخصي" && <form className="settings-form"><div className="profile-photo"><span>م</span><button type="button">تغيير الصورة</button></div><label>الاسم<input defaultValue="محمد أحمد" /></label><label>البريد الإلكتروني<input defaultValue="mohammed@example.com" /></label><label>رقم الهاتف<input defaultValue="+٩٦٦ ٥٠ ١٢٣ ٤٥٦٧" /></label><label>الجهة / المؤسسة<input defaultValue="مركز التنمية المجتمعية" /></label><button className="button button-orange" type="button">حفظ التغييرات</button></form>}
        {tab === "كلمة المرور" && <form className="settings-form"><label>كلمة المرور الحالية<input type="password" /></label><label>كلمة المرور الجديدة<input type="password" /></label><label>تأكيد كلمة المرور<input type="password" /></label><button className="button button-orange" type="button">تحديث كلمة المرور</button></form>}
        {tab === "الإشعارات" && <div className="notification-settings">{["تذكير بالدورات", "الأنشطة الجديدة", "الحملات القادمة"].map((item) => <label key={item}><span><strong>{item}</strong><small>استقبل تنبيهًا عند توفر تحديث جديد.</small></span><input defaultChecked type="checkbox" /></label>)}<button className="button button-orange" type="button">حفظ التفضيلات</button></div>}
      </div></div>
    </DashboardShell>
  );
}

function PlaceholderDashboardPage({ title, active, admin = false }: { title: string; active: string; admin?: boolean }) {
  return <DashboardShell active={active} admin={admin}><div className="dashboard-content"><DashboardTitle title={title} subtitle="المحتوى المرتبط بهذه الصفحة منظم وجاهز للاستخدام." /><div className="empty-state"><span className="large-icon"><Icon name="book" /></span><h2>{title}</h2><p>يمكنك العودة إلى لوحة التحكم أو استكشاف محتوى المنصة.</p><a className="button button-dark" href={admin ? "#/admin" : "#/user"}>العودة إلى لوحة التحكم</a></div></div></DashboardShell>;
}

function getRoute() {
  if (!window.location.hash.startsWith("#/")) return "";
  return window.location.hash.slice(2).replace(/\/$/, "");
}

function App() {
  // Supabase may redirect with ?password_recovery=1 or with #access_token=...&type=recovery.
  // Detect the recovery URL before the auth client consumes its tokens.
  const isRecoveryLink = () => {
    const query = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    return query.has("password_recovery") ||
      (hash.includes("access_token=") && new URLSearchParams(hash.slice(1)).get("type") === "recovery");
  };
  const [route, setRoute] = useState(() => isRecoveryLink() ? "reset-password" : getRoute());
  useEffect(() => {
    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Keep the recovery session intact; URL cleanup happens after password update.
        setRoute("reset-password");
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  const [managedActivities] = useManagedActivities();
  const [managedCourses] = useManagedCourses();
  const [managedResources] = useManagedResources();
  const [managedEvents] = useManagedEvents();

  useEffect(() => {
    const onHashChange = () => {
      setRoute(isRecoveryLink() ? "reset-password" : getRoute());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const pages: Record<string, React.ReactNode> = {
    "": <HomePage />,
    activities: <ActivitiesPage />,
    ...Object.fromEntries(
      [...activitiesPageItems, ...managedActivities.filter((item) => item.status === "منشور" && !activitiesPageItems.some((original) => original.id === item.id))].map((activity) => [
        `activity/${activity.id}`,
<ActivityDetailsPage
  key={activity.id}
  activity={{
    ...activity,
    objective: "objective" in activity ? activity.objective : activity.objectives,
    materials: Array.isArray(activity.materials)
      ? activity.materials
      : activity.materials.split("\n"),
    steps: Array.isArray(activity.steps)
      ? activity.steps
      : activity.steps.split("\n"),
    messages: Array.isArray(activity.messages)
      ? activity.messages
      : activity.messages.split("\n"),
  }}
/>      ]),
    ),
    training: <TrainingPage />,
    "course/rodent-basics": <CourseDetailsPage />,
    "learn/rodent-basics": <LearningPage />,
    library: <LibraryPage />,
    knowledge: <KnowledgeHubPage />,
    ...Object.fromEntries(
      knowledgeArticles.map((article) => [
        `knowledge/${article.id}`,
        <KnowledgeArticlePage article={article} key={article.id} />,
      ]),
    ),
    ...Object.fromEntries(
      managedResources.filter((item) => item.status === "منشور").map((resource) => [
        `resource/${resource.id}`,
        <ResourcePreviewPage resource={resource} key={resource.id} />,
      ]),
    ),
    campaigns: <CampaignsPage />,
    ...Object.fromEntries(
      managedEvents.map((event) => [
        `event/${event.id}`,
        <EventDetailsPage event={event} key={event.id} />,
      ]),
    ),
    "field-tools": <FieldToolsPage />,
    planning: <PlanningPage />,
    monitoring: <MonitoringPage />,
    reports: <ReportsPage />,
    login: <LoginPage />,
    "forgot-password": <ForgotPasswordPage />,
    "reset-password": <ResetPasswordPage />,
    user: <UserDashboard />,
    "user/activities": <PlaceholderDashboardPage active="user/activities" title="أنشطتي" />,
    "user/courses": <UserCoursesPage />,
    "user/certificates": <PlaceholderDashboardPage active="user/certificates" title="الشهادات" />,
    "user/notifications": <PlaceholderDashboardPage active="user/notifications" title="الإشعارات" />,
    settings: <SettingsPage />,
    admin: <AdminDashboard />,
    "admin/activities": <AdminActivitiesPage />,
    "admin/activities/new": <AdminActivityForm />,
    ...Object.fromEntries(managedActivities.map((activity) => [`admin/activities/edit/${activity.id}`, <AdminActivityForm activity={activity} key={activity.id} />])),
    "admin/courses": <AdminCoursesPage />,
    "admin/courses/new": <AdminCourseForm />,
    ...Object.fromEntries(managedCourses.map((course) => [`admin/courses/edit/${course.id}`, <AdminCourseForm course={course} key={course.id} />])),
    "admin/library": <AdminLibraryPage />,
    "admin/library/new": <AdminResourceForm />,
    ...Object.fromEntries(managedResources.map((resource) => [`admin/library/edit/${resource.id}`, <AdminResourceForm resource={resource} key={resource.id} />])),
    "admin/events": <AdminEventsPage />,
    "admin/users": <AdminUsersPage />,
    "admin/messages": <AdminMessagesPage />,
    "admin/reports": <AdminReportsPage />,
    "admin/settings": <AdminSettingsPage />,
  };

  return (
    <div className="route-transition" key={route}>
      {route.startsWith("admin") ? <ProtectedRoute admin>{pages[route] ?? <HomePage />}</ProtectedRoute> : (route === "user" || route.startsWith("user/") || route === "settings") ? <ProtectedRoute admin={false}>{pages[route] ?? <HomePage />}</ProtectedRoute> : (pages[route] ?? <HomePage />)}
    </div>
  );
}

export default App;

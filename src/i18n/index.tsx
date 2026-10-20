import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import ar from "./ar";
import en from "./en";

export type Language = "ar" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: "ar",
  setLanguage: () => undefined,
});

const textSources = new WeakMap<Text, string>();
const attributeSources = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = ["alt", "aria-label", "placeholder", "title"];
const arabicPattern = /[\u0600-\u06ff]/;

function latinDigits(value: string) {
  return value.replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) - (digit.charCodeAt(0) <= 0x0669 ? 0x0660 : 0x06F0))).replace(/٪/g, "%").replace(/٬/g, ",");
}

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

const monthNames: Record<string, string> = {
  "يناير": "January", "فبراير": "February", "مارس": "March", "أبريل": "April",
  "مايو": "May", "يونيو": "June", "يوليو": "July", "أغسطس": "August",
  "سبتمبر": "September", "أكتوبر": "October", "نوفمبر": "November", "ديسمبر": "December",
};
function translateDateFragments(value: string) {
  return value.replace(/(?:يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)/g, (month) => monthNames[month]);
}

function translatedText(source: string, language: Language) {
  if (language === "ar") return latinDigits(source);
  const key = normalize(source);
  const translation = en[key];
  if (!translation) return translateDateFragments(latinDigits(source));
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  return latinDigits(`${leading}${translation}${trailing}`);
}

function translateTextNode(node: Text, language: Language) {
  const current = node.nodeValue ?? "";
  let source = textSources.get(node);
  const expectedTranslation = source ? translatedText(source, "en") : "";

  if (
    !source ||
    arabicPattern.test(current) ||
    (current !== source && current !== expectedTranslation)
  ) {
    source = current;
    textSources.set(node, source);
  }

  const next = translatedText(source, language);
  if (current !== next) node.nodeValue = next;
}

function translateElementAttributes(element: Element, language: Language) {
  let sources = attributeSources.get(element);
  if (!sources) {
    sources = new Map();
    attributeSources.set(element, sources);
  }

  for (const attribute of translatedAttributes) {
    const current = element.getAttribute(attribute);
    if (!current) continue;
    let source = sources.get(attribute);
    const expectedTranslation = source ? en[normalize(source)] ?? source : "";
    if (
      !source ||
      arabicPattern.test(current) ||
      (current !== source && current !== expectedTranslation)
    ) {
      source = current;
      sources.set(attribute, source);
    }
    const next = latinDigits(language === "ar" ? source : en[normalize(source)] ?? translateDateFragments(source));
    if (current !== next) element.setAttribute(attribute, next);
  }
}

function translateSubtree(root: Node, language: Language) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, language);
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
  if (root.nodeType === Node.ELEMENT_NODE) {
    translateElementAttributes(root as Element, language);
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      translateTextNode(node as Text, language);
    } else {
      translateElementAttributes(node as Element, language);
    }
    node = walker.nextNode();
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = window.localStorage.getItem("platform-language");
    return saved === "en" ? "en" : "ar";
  });

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("platform-language", language);
    translateSubtree(document.body, language);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          translateTextNode(mutation.target as Text, language);
        } else if (mutation.type === "attributes") {
          translateElementAttributes(mutation.target as Element, language);
        } else {
          mutation.addedNodes.forEach((node) => translateSubtree(node, language));
        }
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: translatedAttributes,
      characterData: true,
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageSwitch() {
  const { language, setLanguage } = useContext(LanguageContext);
  return (
    <div className="language-switch" aria-label="Language / اللغة" role="group">
      <button
        aria-pressed={language === "ar"}
        className={language === "ar" ? "active" : ""}
        onClick={() => setLanguage("ar")}
        type="button"
      >
        AR
      </button>
      <span aria-hidden="true">|</span>
      <button
        aria-pressed={language === "en"}
        className={language === "en" ? "active" : ""}
        onClick={() => setLanguage("en")}
        type="button"
      >
        EN
      </button>
    </div>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function matchesLocalizedText(source: string, query: string) {
  const normalizedQuery = normalize(query).toLocaleLowerCase();
  if (!normalizedQuery) return true;
  const sourceText = normalize(source).toLocaleLowerCase();
  const englishText = (en[normalize(source)] ?? "").toLocaleLowerCase();
  return sourceText.includes(normalizedQuery) || englishText.includes(normalizedQuery);
}

export { ar, en };

/**
 * Simple i18n: locale override in storage + device locale fallback.
 * Use useLocale() and t() for translated strings.
 * Wrap app with LocaleProvider so language changes apply everywhere.
 */

import React, { useCallback, useContext, useEffect, useState } from "react";
import * as Localization from "expo-localization";
import { getLocaleOverride, setLocaleOverride as persistLocale } from "./storage";

export type Locale = "en" | "ar";

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    home: "Home",
    sleep: "Sleep",
    alarms: "Alarms",
    duas: "Duas",
    prayer: "Prayer",
    settings: "Settings",
    greeting_morning: "Good morning",
    greeting_afternoon: "Good afternoon",
    greeting_evening: "Good evening",
    last_night: "Last night",
    no_sleep_yet: "No sleep logged yet.",
    log_sleep: "Log sleep",
    alarms_short: "Set bedtime and Fajr reminders",
    duas_short: "Read and listen to evening adhkar",
    prayer_times: "Prayer times",
    qibla: "Qibla",
    language: "Language",
    location: "Location",
    use_location_prayer: "Use device location for prayer times",
    export_data: "Export data",
    clear_all_data: "Clear all data",
    about: "About",
    privacy: "Privacy policy",
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    qibla_angle: "Qibla angle",
    degrees: "°",
    need_location: "Enable location for prayer times and Qibla.",
    loading: "Loading…",
    error_load: "Could not load.",
  },
  ar: {
    home: "الرئيسية",
    sleep: "النوم",
    alarms: "المنبهات",
    duas: "الأدعية",
    prayer: "الصلاة",
    settings: "الإعدادات",
    greeting_morning: "صباح الخير",
    greeting_afternoon: "مساء الخير",
    greeting_evening: "مساء الخير",
    last_night: "الليلة الماضية",
    no_sleep_yet: "لم يتم تسجيل نوم بعد.",
    log_sleep: "تسجيل النوم",
    alarms_short: "منبهات النوم والفجر",
    duas_short: "أذكار المساء",
    prayer_times: "أوقات الصلاة",
    qibla: "القبلة",
    language: "اللغة",
    location: "الموقع",
    use_location_prayer: "استخدام موقع الجهاز لأوقات الصلاة",
    export_data: "تصدير البيانات",
    clear_all_data: "مسح كل البيانات",
    about: "حول",
    privacy: "سياسة الخصوصية",
    fajr: "الفجر",
    sunrise: "الشروق",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
    qibla_angle: "زاوية القبلة",
    degrees: "°",
    need_location: "تفعيل الموقع لأوقات الصلاة والقبلة.",
    loading: "جاري التحميل…",
    error_load: "تعذر التحميل.",
  },
};

function normalizeLocale(locale: string | null): Locale {
  if (!locale) return "en";
  const lower = locale.toLowerCase();
  if (lower.startsWith("ar")) return "ar";
  return "en";
}

let cachedLocale: Locale = "en";

export function getLocaleSync(): Locale {
  return cachedLocale;
}

type LocaleContextValue = { locale: Locale; setLocale: (l: Locale) => Promise<void>; t: (key: string) => string };
const LocaleContext = React.createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(cachedLocale);

  useEffect(() => {
    getLocaleOverride().then((override) => {
      const next = override ? normalizeLocale(override) : normalizeLocale(Localization.getLocales()[0]?.languageCode ?? "en");
      cachedLocale = next;
      setLocaleState(next);
    });
  }, []);

  const setLocale = useCallback(async (l: Locale) => {
    await persistLocale(l);
    cachedLocale = l;
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: string) => STRINGS[locale]?.[key] ?? STRINGS.en[key] ?? key,
    [locale]
  );

  return React.createElement(LocaleContext.Provider, { value: { locale, setLocale, t } }, children);
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  const [locale, setLocaleState] = useState<Locale>(cachedLocale);

  useEffect(() => {
    if (ctx) return;
    getLocaleOverride().then((override) => {
      const next = override ? normalizeLocale(override) : normalizeLocale(Localization.getLocales()[0]?.languageCode ?? "en");
      cachedLocale = next;
      setLocaleState(next);
    });
  }, [ctx]);

  const setLocale = useCallback(async (l: Locale) => {
    await persistLocale(l);
    cachedLocale = l;
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: string) => STRINGS[locale]?.[key] ?? STRINGS.en[key] ?? key,
    [locale]
  );

  if (ctx) return ctx;
  return { locale, setLocale, t };
}

export function t(key: string): string {
  return STRINGS[cachedLocale]?.[key] ?? STRINGS.en[key] ?? key;
}

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
    error_load_sleep: "Could not load sleep data.",
    subtitle_blessed: "May your sleep be blessed.",
    record_last_night: "Record last night's sleep",
    prayer_subtitle: "Today's times and Qibla direction",
    tap_to_enable: "Tap to enable",
    retry: "Retry",
    qibla_hint: "Face this direction from North (clockwise) for Salah.",
    log_sleep_subtitle: "Record when you went to bed and woke up.",
    bedtime: "Bedtime",
    waketime: "Wake time",
    save: "Save",
    stats: "Stats",
    recent_entries: "Recent entries",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    no_entries_yet: "No entries yet. Log your first sleep above.",
    missing_fields: "Enter both bedtime and wake time.",
    invalid_time: "Use format HH:mm (e.g. 05:30 or 22:00).",
    alarms_subtitle: "Set reminders for bedtime and Fajr.",
    time: "Time",
    label_optional: "Label (optional)",
    add_alarm: "Add alarm",
    your_alarms: "Your alarms",
    no_alarms_yet: "No alarms yet. Add one above.",
    duas_title: "Bedtime Duas",
    duas_subtitle: "Evening adhkar and verses to recite before sleep.",
    search_duas: "Search duas…",
    all: "All",
    favorites: "Favorites",
    no_matching_duas: "No matching duas.",
    try_again: "Try again",
    remove: "Remove",
    delete_confirm_sleep: "Remove this sleep entry?",
    error: "Error",
    error_save: "Could not save. Please try again.",
    error_delete: "Could not delete. Please try again.",
    error_add: "Could not add alarm. Please try again.",
    error_update: "Could not update alarm. Please try again.",
    error_remove: "Could not remove alarm. Please try again.",
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
    error_load_sleep: "تعذر تحميل بيانات النوم.",
    subtitle_blessed: "بارك الله في نومك.",
    record_last_night: "تسجيل نوم الليلة الماضية",
    prayer_subtitle: "أوقات اليوم واتجاه القبلة",
    tap_to_enable: "اضغط لتفعيل",
    retry: "إعادة",
    qibla_hint: "وجّه هذا الاتجاه من الشمال (باتجاه عقارب الساعة) للصلاة.",
    log_sleep_subtitle: "سجّل وقت نومك واستيقاظك.",
    bedtime: "وقت النوم",
    waketime: "وقت الاستيقاظ",
    save: "حفظ",
    stats: "الإحصائيات",
    recent_entries: "آخر التسجيلات",
    edit: "تعديل",
    delete: "حذف",
    cancel: "إلغاء",
    no_entries_yet: "لا توجد تسجيلات بعد. سجّل نومك أولاً.",
    missing_fields: "أدخل وقت النوم والاستيقاظ.",
    invalid_time: "استخدم الصيغة س:د (مثلاً 05:30 أو 22:00).",
    alarms_subtitle: "منبهات النوم والفجر.",
    time: "الوقت",
    label_optional: "التسمية (اختياري)",
    add_alarm: "إضافة منبه",
    your_alarms: "منبهاتك",
    no_alarms_yet: "لا منبهات بعد. أضف واحداً أعلاه.",
    duas_title: "أدعية النوم",
    duas_subtitle: "أذكار وآيات المساء قبل النوم.",
    search_duas: "البحث في الأدعية…",
    all: "الكل",
    favorites: "المفضلة",
    no_matching_duas: "لا نتائج مطابقة.",
    try_again: "حاول مرة أخرى",
    remove: "إزالة",
    delete_confirm_sleep: "حذف تسجيل النوم هذا؟",
    error: "خطأ",
    error_save: "تعذر الحفظ. حاول مرة أخرى.",
    error_delete: "تعذر الحذف. حاول مرة أخرى.",
    error_add: "تعذر إضافة المنبه. حاول مرة أخرى.",
    error_update: "تعذر التحديث. حاول مرة أخرى.",
    error_remove: "تعذر إزالة المنبه. حاول مرة أخرى.",
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

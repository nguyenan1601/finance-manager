"use client";

import { useI18n } from "@/contexts/i18n-context";

export function useTranslation() {
  const { t, lang, setLang } = useI18n();
  return { t, lang, setLang };
}

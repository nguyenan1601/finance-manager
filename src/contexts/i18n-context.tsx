"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { vi, en, Language } from "@/lib/i18n/dictionaries";
import { supabase } from "@/lib/supabase";

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string, variables?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("vi");

  // Load language from profile or localStorage
  useEffect(() => {
    async function loadLang() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("language")
          .eq("id", user.id)
          .single();

        if (profile?.language) {
          setLangState(profile.language as Language);
          return;
        }
      }

      const savedLang = localStorage.getItem("lang") as Language;
      if (savedLang && (savedLang === "vi" || savedLang === "en")) {
        setLangState(savedLang);
      }
    }
    loadLang();
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = (path: string, variables?: Record<string, string | number>) => {
    const dict = lang === "vi" ? vi : en;
    const keys = path.split(".");

    let result: Record<string, unknown> = dict;
    for (const key of keys) {
      if (result[key] === undefined) return path;
      result = result[key] as Record<string, unknown>;
    }

    if (typeof result !== "string") return path;

    if (variables) {
      return Object.entries(variables).reduce(
        (acc: string, [key, val]) => {
          return acc.replace(`{${key}}`, String(val));
        },
        result as unknown as string,
      );
    }

    return result as unknown as string;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

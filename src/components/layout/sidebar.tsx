"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Bot,
  Settings,
  TrendingUp,
  PieChart,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/hooks/use-translation";

import { User } from "@supabase/supabase-js";

export function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");

  const menuItems = [
    { name: t("common.dashboard"), href: "/", icon: LayoutDashboard },
    { name: t("common.transactions"), href: "/transactions", icon: Receipt },
    { name: t("common.budgets"), href: "/budgets", icon: Wallet },
    { name: t("common.aiAssistant"), href: "/ai-assistant", icon: Bot },
    { name: t("common.reports"), href: "/reports", icon: PieChart },
    { name: t("common.settings"), href: "/settings", icon: Settings },
  ];

  useEffect(() => {
    async function getProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("avatar_url, full_name")
          .eq("id", user.id)
          .single();

        if (profile) {
          setAvatarUrl(profile.avatar_url);
          setFullName(profile.full_name || "");
        }
      }
    }
    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const userEmail = user?.email || t("common.loading");
  const userName =
    fullName || user?.user_metadata?.full_name || userEmail.split("@")[0];
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform sm:translate-x-0">
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-10 flex items-center px-4">
          <TrendingUp className="mr-2 h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">Levi Finance</span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive ? "" : "text-muted-foreground",
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t pt-4 space-y-2">
          <div className="flex items-center px-4 py-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border">
              {avatarUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <span className="text-xs font-bold text-primary">
                  {userInitials}
                </span>
              )}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail}
              </p>
            </div>
          </div>
          {/* <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t("common.logout")}
          </button> */}
        </div>
      </div>
    </aside>
  );
}

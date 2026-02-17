"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "./notification-dropdown";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export function Header() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    async function getProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
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

  const initials = fullName ? fullName.substring(0, 2).toUpperCase() : "";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
      <div className="hidden flex-1 sm:block"></div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full border bg-muted/20 overflow-hidden p-0 cursor-pointer"
        >
          {avatarUrl ? (
            <div className="relative h-full w-full" onClick={() => window.location.href = "/settings"}>
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
                unoptimized // Tránh lỗi loader nếu domain chưa khớp hoàn toàn hoặc cần nhanh
              />
            </div>
          ) : initials ? (
            <span className="text-xs font-bold text-primary">{initials}</span>
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase JS client automatically detects the #access_token hash fragment
    // and sets up the session. We just need to listen for the auth state change.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Auto-create/update profile for Google users
        const { user } = session;
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            full_name:
              user.user_metadata.full_name ||
              user.email?.split("@")[0] ||
              "Người dùng",
            avatar_url: user.user_metadata.avatar_url || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );

        // Redirect to home page
        router.replace("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-sm text-destructive font-medium">{error}</p>
        <button
          onClick={() => router.replace("/login")}
          className="text-sm text-primary hover:underline"
        >
          Quay lại trang đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">
        Đang xác thực, vui lòng chờ...
      </p>
    </div>
  );
}

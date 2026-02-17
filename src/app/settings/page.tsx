"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  User,
  Shield,
  Palette,
  Loader2,
  LogOut,
  KeyRound,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { db } from "@/lib/db";
import { toast } from "sonner";
import { User as IUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import { Language } from "@/lib/i18n/dictionaries";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { t, lang, setLang: setGlobalLang } = useTranslation();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [language, setLanguage] = useState<Language>("vi");
  const [currency, setCurrency] = useState("vnd");

  // Password change states
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function getProfile() {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFullName(profile.full_name || "");
          setAvatarUrl(profile.avatar_url || null);
          const userLang = (profile.language || "vi") as Language;
          setLanguage(userLang);
          setCurrency(profile.currency || "vnd");
        }
      }
      setIsLoading(false);
    }
    getProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await db.updateProfile(user.id, {
        full_name: fullName,
        language,
        currency,
      });
      // Cập nhật ngôn ngữ toàn cục ngay lập tức
      setGlobalLang(language);
      toast.success(t("settings.saved"));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error: unknown) {
      console.error("Error updating profile detailed:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : typeof error === "object"
            ? JSON.stringify(error)
            : String(error);
      toast.error(`${t("common.error")}: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(
        lang === "vi"
          ? "Mật khẩu xác nhận không khớp"
          : "Passwords do not match",
      );
      return;
    }
    if (newPassword.length < 6) {
      toast.error(
        lang === "vi"
          ? "Mật khẩu phải có ít nhất 6 ký tự"
          : "Password must be at least 6 characters",
      );
      return;
    }

    setIsPasswordChanging(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      toast.success(
        lang === "vi"
          ? "Đổi mật khẩu thành công"
          : "Password changed successfully",
      );
      setIsPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("common.error");
      toast.error(message);
    } finally {
      setIsPasswordChanging(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Giới hạn 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        lang === "vi"
          ? "Ảnh phải nhỏ hơn 2MB"
          : "Image size must be less than 2MB",
      );
      return;
    }

    setIsAvatarUploading(true);
    try {
      const publicUrl = await db.uploadAvatar(user.id, file);
      console.log("Avatar upload successful. Public URL:", publicUrl);
      setAvatarUrl(publicUrl);
      toast.success(t("common.success"));
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Avatar upload error details:", err);
      toast.error(`${t("common.error")}: ${err.message || "Unknown error"}`);
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleLogout = async () => {
    const confirmMsg =
      lang === "vi"
        ? "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?"
        : "Are you sure you want to log out?";
    const ok = window.confirm(confirmMsg);
    if (!ok) return;

    try {
      await supabase.auth.signOut();
      router.push("/login");
      toast.success(lang === "vi" ? "Hẹn gặp lại bạn!" : "See you again!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("common.error"));
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        </div>
      </DashboardLayout>
    );
  }

  const initials = fullName
    ? fullName.substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "??";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("settings.title")}
            </h1>
            <p className="text-muted-foreground italic">
              {t("settings.subtitle")}
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("common.logout")}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Profile Section */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden font-sans">
            <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-muted/20">
              <div className="p-2 bg-primary/10 rounded-xl">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  {t("settings.profileInfo")}
                </CardTitle>
                <CardDescription>{t("settings.profileDesc")}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 font-sans">
              <div className="flex flex-col items-center sm:flex-row gap-6 pb-2">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-3xl bg-primary/10 border-4 border-background shadow-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                    {isAvatarUploading ? (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : avatarUrl ? (
                      <div className="h-full w-full relative">
                        <Image
                          src={avatarUrl}
                          alt="Avatar"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <span className="text-2xl font-black text-primary">
                        {initials}
                      </span>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-1 -right-1 h-8 w-8 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors border-2 border-background"
                  >
                    <User className="h-4 w-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={isAvatarUploading}
                    />
                  </label>
                </div>
                <div className="flex flex-col gap-2 text-center sm:text-left">
                  <h3 className="font-bold text-xl">
                    {fullName || (lang === "vi" ? "Người dùng" : "User")}
                  </h3>
                  <p className="text-sm text-muted-foreground italic bg-muted/50 px-3 py-1 rounded-full">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="font-bold">
                    {t("settings.fullName")}
                  </Label>
                  <Input
                    id="fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="rounded-xl h-11"
                    placeholder={
                      lang === "vi" ? "VD: Nguyễn Văn A" : "E.g: John Doe"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">
                    {t("settings.email")}
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="rounded-xl h-11 bg-muted/50 text-muted-foreground"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-muted/20">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <Palette className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  {t("settings.appSettings")}
                </CardTitle>
                <CardDescription>
                  {t("settings.appSettingsDesc")}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-bold">{t("settings.language")}</Label>
                  <Select
                    value={language}
                    onValueChange={(val: Language) => setLanguage(val)}
                  >
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue
                        placeholder={
                          lang === "vi" ? "Chọn ngôn ngữ" : "Select language"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">{t("settings.theme")}</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        {t("settings.light")}
                      </SelectItem>
                      <SelectItem value="dark">{t("settings.dark")}</SelectItem>
                      <SelectItem value="system">
                        {t("settings.system")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">{t("settings.currency")}</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue
                        placeholder={
                          lang === "vi" ? "Chọn đơn vị" : "Select currency"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vnd">VND (₫)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-muted/20">
              <div className="p-2 bg-rose-500/10 rounded-xl">
                <Shield className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  {t("settings.security")}
                </CardTitle>
                <CardDescription>{t("settings.securityDesc")}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between py-4 border-b">
                <div className="space-y-1">
                  <p className="text-sm font-bold">
                    {t("settings.changePassword")}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {t("settings.passwordDesc")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-9 px-4"
                  onClick={() => setIsPasswordDialogOpen(true)}
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  {t("settings.changePassword")}
                </Button>
              </div>
              <div className="flex items-center justify-between py-4 border-b opacity-50 cursor-not-allowed">
                <div className="space-y-1">
                  <p className="text-sm font-bold">{t("settings.twoFactor")}</p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "vi"
                      ? "Tăng cường bảo mật qua số điện thoại."
                      : "Enhanced security via phone number."}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {t("settings.comingSoon")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Save Button for Profile & Preferences */}
          <div className="flex justify-end pt-2">
            <Button
              className={`rounded-xl h-12 px-10 font-black shadow-lg transition-all duration-300 ${
                isSaved
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                  : "shadow-primary/20"
              }`}
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("settings.saving")}
                </>
              ) : isSaved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t("settings.saved")} ✓
                </>
              ) : (
                t("settings.saveAll")
              )}
            </Button>
          </div>

          <div className="h-8" />

          {/* Danger Zone */}
          <Card className="border-rose-100 bg-rose-50/30 dark:bg-rose-950/10 shadow-none rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-rose-600 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t("settings.dangerZone")}
              </CardTitle>
              <CardDescription>{t("settings.dangerDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">
                    {t("settings.clearTransactions")}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {t("settings.clearDesc")}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl"
                  onClick={async () => {
                    const confirmMsg =
                      lang === "vi"
                        ? "CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn TOÀN BỘ giao dịch của bạn. Bạn có chắc chắn không?"
                        : "WARNING: This action will permanently delete ALL your transactions. Are you sure?";
                    const ok = window.confirm(confirmMsg);
                    if (ok) {
                      try {
                        await db.resetTransactions();
                        toast.success(
                          lang === "vi"
                            ? "Đã xóa sạch toàn bộ giao dịch."
                            : "Cleared all transactions successfully.",
                        );
                        window.location.reload();
                      } catch (error) {
                        console.error("Reset data error:", error);
                        toast.error(t("common.error"));
                      }
                    }
                  }}
                >
                  {t("settings.resetData")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {t("settings.changePassword")}
            </DialogTitle>
            <DialogDescription>
              {lang === "vi"
                ? "Mật khẩu mới phải có ít nhất 6 ký tự."
                : "New password must be at least 6 characters."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">
                  {lang === "vi" ? "Mật khẩu mới" : "New Password"}
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  {lang === "vi" ? "Xác nhận mật khẩu" : "Confirm Password"}
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-xl h-11"
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
                className="rounded-xl h-11"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPasswordChanging}
                className="rounded-xl h-11 px-6 font-bold"
              >
                {isPasswordChanging ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {lang === "vi" ? "Đang cập nhật..." : "Updating..."}
                  </>
                ) : lang === "vi" ? (
                  "Cập nhật mật khẩu"
                ) : (
                  "Update Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

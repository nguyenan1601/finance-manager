"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
  DialogTrigger,
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
import { PageHeader } from "@/components/common/page-header";
import { PageShell } from "@/components/common/page-shell";
import { Panel } from "@/components/common/panel";

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
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
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
        <PageShell className="mx-auto max-w-4xl">
          <PageHeader
            title={t("settings.title")}
            description={t("settings.subtitle")}
          />
          <div className="grid gap-6">
            <div className="space-y-6 rounded-xl bg-card p-6 shadow-sm">
              <Skeleton className="h-5 w-40" />
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
            <div className="space-y-6 rounded-xl bg-card p-6 shadow-sm">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>
        </PageShell>
      </DashboardLayout>
    );
  }

  const initials = fullName
    ? fullName.substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "??";

  return (
    <DashboardLayout>
      <PageShell className="mx-auto max-w-4xl">
        <PageHeader
          title={t("settings.title")}
          description={t("settings.subtitle")}
          actions={
            <Dialog
              open={isLogoutDialogOpen}
              onOpenChange={setIsLogoutDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t("common.logout")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("common.logoutConfirmTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("common.logoutConfirmDesc")}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="ghost"
                    onClick={() => setIsLogoutDialogOpen(false)}
                    className="rounded-lg"
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="rounded-lg shadow-lg shadow-destructive/20"
                  >
                    {t("common.logout")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="grid gap-6">
          {/* Profile Section */}
          <Panel className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 bg-muted/20 pb-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <User className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  {t("settings.profileInfo")}
                </CardTitle>
                <CardDescription>{t("settings.profileDesc")}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col items-center gap-6 pb-2 sm:flex-row">
                <div className="group relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-primary/10 shadow-xl transition-transform group-hover:scale-105">
                    {isAvatarUploading ? (
                      <div
                        role="status"
                        aria-busy="true"
                        className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm"
                      >
                        <Loader2
                          className="h-8 w-8 animate-spin text-primary"
                          aria-hidden="true"
                        />
                      </div>
                    ) : avatarUrl ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={avatarUrl}
                          alt=""
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
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-2 border-background bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">
                      {lang === "vi" ? "Đổi ảnh đại diện" : "Change avatar"}
                    </span>
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
                  <h2 className="text-xl font-bold">
                    {fullName || (lang === "vi" ? "Người dùng" : "User")}
                  </h2>
                  <p className="rounded-full bg-muted/50 px-3 py-1 text-sm italic text-muted-foreground">
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
                    className="h-11 rounded-lg"
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
                    className="h-11 rounded-lg bg-muted/50 text-muted-foreground"
                  />
                </div>
              </div>
            </CardContent>
          </Panel>

          {/* Preferences Section */}
          <Panel className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 bg-muted/20 pb-2">
              <div className="rounded-lg bg-warning-muted p-2">
                <Palette
                  className="h-5 w-5 text-warning"
                  aria-hidden="true"
                />
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
                  <Label htmlFor="language" className="font-bold">
                    {t("settings.language")}
                  </Label>
                  <Select
                    value={language}
                    onValueChange={(val: Language) => setLanguage(val)}
                  >
                    <SelectTrigger id="language" className="h-11 rounded-lg">
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
                  <Label htmlFor="theme" className="font-bold">
                    {t("settings.theme")}
                  </Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme" className="h-11 rounded-lg">
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
                  <Label htmlFor="currency" className="font-bold">
                    {t("settings.currency")}
                  </Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency" className="h-11 rounded-lg">
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
          </Panel>

          {/* Security Section */}
          <Panel className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 bg-muted/20 pb-2">
              <div className="rounded-lg bg-danger-muted p-2">
                <Shield className="h-5 w-5 text-danger" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  {t("settings.security")}
                </CardTitle>
                <CardDescription>{t("settings.securityDesc")}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b py-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold">
                    {t("settings.changePassword")}
                  </p>
                  <p className="text-xs italic text-muted-foreground">
                    {t("settings.passwordDesc")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg px-4"
                  onClick={() => setIsPasswordDialogOpen(true)}
                >
                  <KeyRound className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t("settings.changePassword")}
                </Button>
              </div>
              <div className="flex cursor-not-allowed items-center justify-between border-b py-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-muted-foreground">
                    {t("settings.twoFactor")}
                  </p>
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
          </Panel>

          {/* Save Button for Profile & Preferences */}
          <div className="flex justify-end pt-2">
            <Button
              className={`h-12 rounded-lg px-10 font-black shadow-lg transition-all duration-300 ${
                isSaved
                  ? "bg-success hover:bg-success/90 shadow-success/20"
                  : "shadow-primary/20"
              }`}
              onClick={handleSaveProfile}
              disabled={isSaving}
              aria-busy={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  {t("settings.saving")}
                </>
              ) : isSaved ? (
                <>
                  <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t("settings.saved")}
                </>
              ) : (
                t("settings.saveAll")
              )}
            </Button>
          </div>

          {/* Danger Zone */}
          <Panel className="overflow-hidden border border-danger/20 bg-danger/5 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-danger">
                <Shield className="h-5 w-5" aria-hidden="true" />
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
                  <p className="text-xs italic text-muted-foreground">
                    {t("settings.clearDesc")}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-lg"
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
          </Panel>
        </div>
      </PageShell>

      {/* Change Password Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
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
                  className="h-11 rounded-lg"
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
                  className="h-11 rounded-lg"
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
                className="h-11 rounded-lg"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPasswordChanging}
                aria-busy={isPasswordChanging}
                className="h-11 rounded-lg px-6 font-bold"
              >
                {isPasswordChanging ? (
                  <>
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
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

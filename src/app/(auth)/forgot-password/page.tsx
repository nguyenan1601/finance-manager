"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  Mail,
  ArrowRight,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        },
      );

      if (resetError) throw resetError;

      setIsSuccess(true);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Đã có lỗi xảy ra khi gửi yêu cầu.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-1 text-center font-sans">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <TrendingUp className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Quên mật khẩu?
          </CardTitle>
          <CardDescription>
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSuccess ? (
            <div
              role="status"
              className="flex flex-col items-center justify-center space-y-4 py-4"
            >
              <div className="rounded-full bg-success-muted p-3 text-success">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </div>
              <p className="text-center text-sm font-medium">
                Nếu email bạn nhập có trong hệ thống, bạn sẽ nhận được một liên
                kết để đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến (và cả
                thư rác).
              </p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="email"
                    type="email"
                    aria-label="Email"
                    placeholder="email@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-none bg-muted/50 focus-visible:ring-primary"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className="w-full h-11 font-semibold group rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <>
                    Gửi liên kết khôi phục
                    <ArrowRight
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center pb-8 font-sans">
          <p className="text-sm text-muted-foreground">
            Nhớ mật khẩu rồi?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-3 w-3" aria-hidden="true" />
              Quay lại đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

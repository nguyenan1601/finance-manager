import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Plus,
  Check,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

interface ParsedTransaction {
  amount: number;
  type: "income" | "expense";
  category: string;
  note: string;
  date: string;
}

import { useTranslation } from "@/hooks/use-translation";

export function SmartInput({ onAdd }: { onAdd?: () => void }) {
  const { t, lang } = useTranslation();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [suggestion, setSuggestion] = useState<ParsedTransaction | null>(null);
  const [success, setSuccess] = useState(false);

  const handleParse = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setSuccess(false);
    try {
      const resp = await fetch("/api/ai/parse-transaction", {
        method: "POST",
        body: JSON.stringify({
          text,
          currentDate: new Date().toLocaleDateString("en-CA"),
        }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.details || data.error);
      setSuggestion(data);
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      alert(`${lang === "vi" ? "Lỗi AI" : "AI Error"}: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAdd = async () => {
    if (!suggestion) return;

    setIsAdding(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert(
          lang === "vi"
            ? "Bạn cần đăng nhập để lưu giao dịch."
            : "You need to log in to save transactions.",
        );
        return;
      }

      // Convert category name to ID
      const categoryId = await db.getCategoryIdByName(
        suggestion.category,
        suggestion.type,
        user.id,
      );

      await db.addTransaction({
        user_id: user.id,
        amount: suggestion.amount,
        type: suggestion.type,
        category_id: categoryId,
        note: suggestion.note,
        date: suggestion.date,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      if (onAdd) onAdd();
      setSuggestion(null);
      setText("");
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : JSON.stringify(error);
      console.error("Error saving smart transaction:", errMsg, error);
      alert(
        `${lang === "vi" ? "Không thể lưu giao dịch" : "Cannot save transaction"}: ${errMsg}`,
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-indigo-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
        <div className="relative flex items-center bg-card rounded-2xl p-1.5 shadow-sm border">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleParse()}
            placeholder={t("common.smartInputPlaceholder")}
            className="border-none focus-visible:ring-0 text-md h-12 bg-transparent"
          />
          <Button
            onClick={handleParse}
            disabled={isLoading || !text}
            className="rounded-xl h-11 px-4 shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {lang === "vi" ? "Xử lý AI" : "Process AI"}
              </>
            )}
          </Button>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm animate-in fade-in slide-in-from-left-2 px-2">
          <Check className="h-4 w-4" />
          {lang === "vi"
            ? "Đã lưu giao dịch thành công!"
            : "Transaction saved successfully!"}
        </div>
      )}

      {suggestion && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    suggestion.type === "expense" ? "destructive" : "default"
                  }
                  className="rounded-md"
                >
                  {suggestion.type === "expense"
                    ? lang === "vi"
                      ? "Chi tiêu"
                      : "Expense"
                    : lang === "vi"
                      ? "Thu nhập"
                      : "Income"}
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {suggestion.category}
                </Badge>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium ml-1">
                  <CalendarIcon className="h-3 w-3" />
                  {new Date(suggestion.date).toLocaleDateString(
                    lang === "vi" ? "vi-VN" : "en-US",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    },
                  )}
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">
                  {suggestion.amount.toLocaleString(
                    lang === "vi" ? "vi-VN" : "en-US",
                  )}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {lang === "vi" ? "VND" : "USD"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                &quot;{suggestion.note}&quot;
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={confirmAdd}
                size="sm"
                className="rounded-lg"
                disabled={isAdding}
              >
                {isAdding ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    {lang === "vi" ? "Thêm ngay" : "Add now"}
                  </>
                )}
              </Button>
              <Button
                onClick={() => setSuggestion(null)}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

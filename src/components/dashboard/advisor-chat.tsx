"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Bot, User, Send, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { db, Transaction } from "@/lib/db";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useTranslation } from "@/hooks/use-translation";

// --- Chat History Persistence ---
const STORAGE_KEY = "levi-ai-chat-history";
const MAX_MESSAGES = 50;

function getWelcomeMessage(lang: string): UIMessage {
  return {
    id: "welcome",
    role: "assistant",
    parts: [
      {
        type: "text",
        text:
          lang === "vi"
            ? "Chào bạn! Tôi là Levi AI 🤖. Tôi có thể phân tích chi tiêu, đưa ra lời khuyên tài chính, hoặc giúp bạn lập kế hoạch tiết kiệm. Hãy hỏi tôi bất cứ điều gì!"
            : "Hello! I am Levi AI 🤖. I can analyze your spending, provide financial advice, or help you create a savings plan. Feel free to ask me anything!",
      },
    ],
  };
}

function saveMessages(messages: UIMessage[]): void {
  try {
    // Only keep last MAX_MESSAGES to prevent localStorage overflow
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

function loadMessages(lang: string): UIMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [getWelcomeMessage(lang)];
    const parsed = JSON.parse(raw) as UIMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0)
      return [getWelcomeMessage(lang)];
    return parsed;
  } catch {
    return [getWelcomeMessage(lang)];
  }
}

function clearMessages(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently ignore
  }
}

// Build financial summary from transactions
function buildFinancialSummary(
  transactions: Transaction[],
  lang: string,
): string {
  const isVi = lang === "vi";
  if (!transactions || transactions.length === 0) {
    return isVi
      ? "Người dùng chưa có giao dịch nào."
      : "User has no transactions yet.";
  }

  const currencyFormat = isVi ? "vi-VN" : "en-US";
  const currencySymbol = isVi ? "đ" : "$";

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  // Group expenses by category
  const expenseByCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const cat = t.categories?.name || (isVi ? "Khác" : "Other");
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Number(t.amount);
    });

  const categoryBreakdown = Object.entries(expenseByCategory)
    .sort(([, a], [, b]) => b - a)
    .map(
      ([cat, amt]) =>
        `  - ${cat}: ${amt.toLocaleString(currencyFormat)}${currencySymbol}`,
    )
    .join("\n");

  const recentList = transactions
    .slice(0, 15)
    .map(
      (t) =>
        `  - ${t.date}: ${t.type === "income" ? (isVi ? "Thu" : "In") : isVi ? "Chi" : "Ex"} ${Number(t.amount).toLocaleString(currencyFormat)}${currencySymbol} - ${t.categories?.name || (isVi ? "Khác" : "Other")} (${t.note || (isVi ? "không ghi chú" : "no note")})`,
    )
    .join("\n");

  if (isVi) {
    return [
      `TỔNG QUAN TÀI CHÍNH:`,
      `- Tổng thu nhập: ${totalIncome.toLocaleString("vi-VN")}đ`,
      `- Tổng chi tiêu: ${totalExpense.toLocaleString("vi-VN")}đ`,
      `- Số dư hiện tại: ${balance.toLocaleString("vi-VN")}đ`,
      `- Số giao dịch: ${transactions.length}`,
      ``,
      `CHI TIÊU THEO DANH MỤC:`,
      categoryBreakdown,
      ``,
      `GIAO DỊCH GẦN ĐÂY (${Math.min(15, transactions.length)} gần nhất):`,
      recentList,
    ].join("\n");
  }

  return [
    `FINANCIAL OVERVIEW:`,
    `- Total Income: ${totalIncome.toLocaleString("en-US")}$`,
    `- Total Expenses: ${totalExpense.toLocaleString("en-US")}$`,
    `- Current Balance: ${balance.toLocaleString("en-US")}$`,
    `- Number of Transactions: ${transactions.length}`,
    ``,
    `EXPENSES BY CATEGORY:`,
    categoryBreakdown,
    ``,
    `RECENT TRANSACTIONS (Last ${Math.min(15, transactions.length)}):`,
    recentList,
  ].join("\n");
}

// Module-level variable to store financial data — avoids ref-during-render issue
let _latestFinancialData = "";

export function AdvisorChat() {
  const { lang } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load saved messages from localStorage (runs only once on mount)
  const [initialMessages] = useState<UIMessage[]>(() => loadMessages(lang));

  // Load financial data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const transactions = (await db.getTransactions()) as Transaction[];
        _latestFinancialData = buildFinancialSummary(transactions, lang);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading financial data:", error);
        _latestFinancialData =
          lang === "vi"
            ? "Không thể tải dữ liệu giao dịch."
            : "Cannot load transaction data.";
        setDataLoaded(true);
      }
    }
    loadData();
  }, [lang]);

  // Stable transport — reads module-level variable via function (no ref access in render)
  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/advisor",
        body: () => ({ financialContext: _latestFinancialData }),
      }),
  );

  const { messages, setMessages, sendMessage, status, error } = useChat({
    transport,
    messages: initialMessages,
    onError: (err) => {
      console.error("[AdvisorChat] onError:", err);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Persist messages to localStorage whenever they change (skip while streaming)
  useEffect(() => {
    if (status === "streaming" || status === "submitted") return;
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages, status]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Reset chat to welcome message
  const handleNewChat = useCallback(() => {
    clearMessages();
    setMessages([getWelcomeMessage(lang)]);
  }, [setMessages, lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // If data not loaded yet, try loading now
    if (!dataLoaded) {
      try {
        const transactions = (await db.getTransactions()) as Transaction[];
        _latestFinancialData = buildFinancialSummary(transactions, lang);
      } catch {
        // Continue anyway
      }
    }

    const text = input;
    setInput("");
    try {
      await sendMessage({ text });
    } catch (err) {
      console.error("[AdvisorChat] sendMessage error:", err);
    }
  };

  // Extract text from message parts
  const getMessageText = (m: (typeof messages)[0]): string => {
    return m.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");
  };

  return (
    <Card className="flex flex-col h-[calc(100dvh-8rem)] sm:h-[650px] border-none shadow-xl overflow-hidden bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
      <CardHeader className="shrink-0 bg-primary px-4 sm:px-6 py-3 sm:py-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg text-white font-bold">
              {lang === "vi" ? "Trợ lý Levi AI" : "Levi AI Assistant"}
            </CardTitle>
            <p className="text-xs text-white/70">
              {isLoading
                ? lang === "vi"
                  ? "Đang trả lời..."
                  : "Replying..."
                : lang === "vi"
                  ? "Đang trực tuyến"
                  : "Online"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            disabled={isLoading}
            title={lang === "vi" ? "Cuộc hội thoại mới" : "New chat"}
            className="h-9 w-9 rounded-lg text-white/80 hover:text-white hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
        </div>
      </CardHeader>

      <div
        className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4"
        style={{ minHeight: 0 }}
      >
        {messages.map((m) => {
          const isUser = (m.role as string) === "user";
          return (
            <div
              key={m.id}
              className={cn(
                "w-fit max-w-[90%] sm:max-w-[85%] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm shadow-sm",
                isUser
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto bg-muted text-foreground",
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {isUser ? (
                  <User className="h-4 w-4 shrink-0" />
                ) : (
                  <Bot className="h-4 w-4 shrink-0" />
                )}
                <span className="font-bold text-xs">
                  {isUser ? (lang === "vi" ? "Bạn" : "You") : "Levi AI"}
                </span>
              </div>
              <div className="leading-relaxed prose prose-sm dark:prose-invert max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                {!isUser ? (
                  <ReactMarkdown>{getMessageText(m)}</ReactMarkdown>
                ) : (
                  <p className="m-0">{getMessageText(m)}</p>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="w-fit max-w-[80%] mr-auto rounded-2xl bg-muted px-4 py-3 text-sm">
            <div className="flex items-center gap-2 italic text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {lang === "vi"
                ? "Levi AI đang suy nghĩ..."
                : "Levi AI is thinking..."}
            </div>
          </div>
        )}

        {error && (
          <div className="w-fit max-w-[85%] mr-auto rounded-2xl bg-red-100 text-red-700 px-4 py-3 text-sm">
            ⚠️ {lang === "vi" ? "Lỗi" : "Error"}:{" "}
            {error.message ||
              (lang === "vi"
                ? "Không thể kết nối tới trợ lý AI"
                : "Cannot connect to AI assistant")}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 p-3 sm:p-4 border-t bg-white dark:bg-gray-900"
      >
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              lang === "vi"
                ? "Hỏi Levi AI về tài chính..."
                : "Ask Levi AI about finance..."
            }
            className="flex-1 h-11 sm:h-12 border-none bg-muted/50 rounded-xl focus-visible:ring-primary text-sm"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input}
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl shadow-lg shadow-primary/20"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </Card>
  );
}

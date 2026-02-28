"use client";

import { useState, useEffect } from "react";
import { Bell, ShoppingBag, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db, Transaction } from "@/lib/db";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/hooks/use-translation";

export function NotificationDropdown() {
  const { t, lang } = useTranslation();
  const [notifications, setNotifications] = useState<Transaction[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const savedId = localStorage.getItem("last_notified_transaction_id");

    const fetchNotifications = async () => {
      try {
        const transactions = await db.getTransactions();
        if (transactions) {
          const recent = transactions.slice(0, 10);
          setNotifications(recent);

          if (recent.length > 0) {
            if (!savedId) {
              setUnreadCount(recent.length);
            } else {
              const index = recent.findIndex((t) => t.id === savedId);
              if (index === -1) {
                setUnreadCount(recent.length);
              } else {
                setUnreadCount(index);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    let channel: ReturnType<typeof supabase.channel> | null = null;

    // Sử dụng onAuthStateChange để đảm bảo có user thì mới subscribe
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        if (channel) supabase.removeChannel(channel);

        console.log("Setting up Realtime for user:", session.user.id);

        channel = supabase
          .channel(`transactions-channel-${session.user.id}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "transactions",
              // Tạm thời bỏ filter để test signal rộng hơn,
              // Supabase RLS vẫn sẽ đảm bảo bảo mật.
            },
            (payload) => {
              console.log("REALTIME_EVENT:", payload);
              fetchNotifications();
            },
          )
          .subscribe((status) => {
            console.log("REALTIME_STATUS:", status);
          });
      }
    });

    return () => {
      subscription.unsubscribe();
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (open && notifications.length > 0) {
      // Khi mở ra, đánh dấu là đã đọc bằng cách lưu ID của giao dịch mới nhất
      const latestId = notifications[0].id;
      localStorage.setItem("last_notified_transaction_id", latestId);
      setUnreadCount(0);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full cursor-pointer"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 rounded-2xl p-0 shadow-xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="p-4 font-bold text-base flex items-center justify-between">
          Thông báo
          <span className="text-xs font-medium text-muted-foreground">
            {notifications.length} giao dịch gần đây
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <div className="p-3 bg-muted rounded-full mb-3">
                <Bell className="h-6 w-6 text-muted-foreground opacity-50" />
              </div>
              <p className="text-sm font-medium">Chưa có thông báo nào</p>
              <p className="text-xs text-muted-foreground mt-1">
                Các giao dịch mới của bạn sẽ xuất hiện ở đây.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((t, index) => {
                const isUnread = index < unreadCount;
                return (
                  <DropdownMenuItem
                    key={t.id}
                    className={cn(
                      "flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50 transition-colors",
                      isUnread && "bg-primary/[0.03]",
                    )}
                  >
                    <div className="flex w-full items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center text-white"
                        style={{
                          backgroundColor: t.categories?.color || "#6366f1",
                        }}
                      >
                        {t.type === "income" ? (
                          <Plus className="h-4 w-4" />
                        ) : (
                          <ShoppingBag className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate">
                          {t.type === "income"
                            ? lang === "vi"
                              ? "+ "
                              : "Received: "
                            : lang === "vi"
                              ? "- "
                              : "Spent: "}
                          {Number(t.amount).toLocaleString(
                            lang === "vi" ? "vi-VN" : "en-US",
                          )}{" "}
                          {lang === "vi" ? "₫" : "$"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {t.categories?.name} - {t.note || "Không có ghi chú"}
                        </p>
                      </div>
                      {isUnread && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 self-end">
                      {formatDistanceToNow(new Date(t.date), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </DropdownMenuItem>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full text-xs font-bold rounded-lg h-9"
            asChild
          >
            <a href="/transactions">Xem tất cả giao dịch</a>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

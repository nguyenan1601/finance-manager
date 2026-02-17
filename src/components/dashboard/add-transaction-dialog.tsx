"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { db, Category } from "@/lib/db";
import { supabase } from "@/lib/supabase";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: () => void;
}

export function AddTransactionDialog({
  open,
  onOpenChange,
  onAdd,
}: AddTransactionDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense" as "income" | "expense",
    category_id: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    async function fetchCategories() {
      if (!open) return;
      setIsFetchingCategories(true);
      try {
        const data = await db.getCategories(formData.type);
        setCategories(data);
        if (data.length > 0) {
          // Only update if current category_id is not in new categories
          const exists = data.find(
            (c: Category) => c.id === formData.category_id,
          );
          if (!exists) {
            setFormData((prev) => ({ ...prev, category_id: data[0].id }));
          }
        }
      } catch (error: unknown) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsFetchingCategories(false);
      }
    }
    fetchCategories();
  }, [open, formData.type, formData.category_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Bạn cần đăng nhập để thực hiện thao tác này.");
        return;
      }

      await db.addTransaction({
        user_id: user.id,
        amount: Number(formData.amount),
        type: formData.type,
        category_id: formData.category_id,
        note: formData.note,
        date: formData.date,
      });

      if (onAdd) onAdd();
      onOpenChange(false);
      setFormData({
        amount: "",
        type: "expense",
        category_id: "",
        note: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error: unknown) {
      console.error("Error adding transaction:", error);
      alert("Đã có lỗi xảy ra khi lưu giao dịch.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Thêm giao dịch mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (₫)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              className="h-11 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại</Label>
              <Select
                value={formData.type}
                onValueChange={(v: "income" | "expense") =>
                  setFormData({ ...formData, type: v })
                }
              >
                <SelectTrigger className="h-11 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Chi tiêu</SelectItem>
                  <SelectItem value="income">Thu nhập</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ngày</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="h-11 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Danh mục</Label>
            <Select
              value={formData.category_id}
              onValueChange={(v) =>
                setFormData({ ...formData, category_id: v })
              }
              disabled={isFetchingCategories}
            >
              <SelectTrigger className="h-11 rounded-lg">
                <SelectValue
                  placeholder={
                    isFetchingCategories ? "Đang tải..." : "Chọn danh mục"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Input
              id="note"
              placeholder="Nhập ghi chú..."
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="h-11 rounded-lg"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Lưu giao dịch"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

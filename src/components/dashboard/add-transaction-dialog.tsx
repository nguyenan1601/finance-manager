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

const NOTE_MAX_LENGTH = 100;

export interface TransactionFormData {
  id?: string;
  amount: string;
  type: "income" | "expense";
  category_id: string;
  note: string;
  date: string;
}

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: () => void;
  /** If provided, the dialog will be in edit mode */
  editData?: TransactionFormData | null;
}

const defaultFormData: TransactionFormData = {
  amount: "",
  type: "expense",
  category_id: "",
  note: "",
  date: new Date().toISOString().split("T")[0],
};

export function AddTransactionDialog({
  open,
  onOpenChange,
  onAdd,
  editData,
}: AddTransactionDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [formData, setFormData] =
    useState<TransactionFormData>(defaultFormData);

  const isEditMode = !!editData?.id;

  // Populate form when editData changes
  useEffect(() => {
    if (editData && open) {
      setFormData(editData);
    } else if (!open) {
      setFormData(defaultFormData);
    }
  }, [editData, open]);

  useEffect(() => {
    async function fetchCategories() {
      if (!open) return;
      setIsFetchingCategories(true);
      try {
        const data = await db.getCategories(formData.type);
        setCategories(data);
        if (data.length > 0) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, formData.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate amount: must be a positive number
    const amount = Number(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      alert("Số tiền phải là một số dương lớn hơn 0.");
      return;
    }

    // Validate note length
    if (formData.note.length > NOTE_MAX_LENGTH) {
      alert(`Ghi chú không được vượt quá ${NOTE_MAX_LENGTH} ký tự.`);
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode && editData?.id) {
        // Edit mode
        await db.updateTransaction(editData.id, {
          amount: Number(formData.amount),
          type: formData.type,
          category_id: formData.category_id,
          note: formData.note,
          date: formData.date,
        });
      } else {
        // Add mode
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
      }

      if (onAdd) onAdd();
      onOpenChange(false);
      setFormData(defaultFormData);
    } catch (error: unknown) {
      console.error("Error saving transaction:", error);
      alert("Đã có lỗi xảy ra khi lưu giao dịch.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (₫)</Label>
            <Input
              id="amount"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => {
                // Only allow digits (no +, -, e, .)
                const val = e.target.value.replace(/[^0-9]/g, "");
                setFormData({ ...formData, amount: val });
              }}
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
              onChange={(e) => {
                if (e.target.value.length <= NOTE_MAX_LENGTH) {
                  setFormData({ ...formData, note: e.target.value });
                }
              }}
              maxLength={NOTE_MAX_LENGTH}
              className="h-11 rounded-lg"
            />
            <p
              className={`text-xs text-right ${formData.note.length >= NOTE_MAX_LENGTH ? "text-destructive" : "text-muted-foreground"}`}
            >
              {formData.note.length}/{NOTE_MAX_LENGTH}
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isEditMode ? (
                "Cập nhật giao dịch"
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

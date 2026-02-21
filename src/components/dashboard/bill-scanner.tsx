"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Receipt } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "sonner";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface BillScannerProps {
  onSuccess?: () => void;
}

export function BillScanner({ onSuccess }: BillScannerProps) {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{
    amount: number;
    category: string;
    note: string;
    date: string;
    type: "expense";
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setIsPreviewOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const startScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setIsPreviewOpen(false);

    try {
      const response = await fetch("/api/ai/scan-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage, // Full data URL (data:image/...;base64,...)
          currentDate: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Scan bill API error:", response.status, errorData);
        throw new Error(
          errorData.details ||
            errorData.error ||
            `API error ${response.status}`,
        );
      }

      const result = await response.json();
      setScanResult(result);
      setIsConfirmOpen(true);
      toast.success(t("common.scanSuccess"));
    } catch (error) {
      console.error("Scan error:", error);
      toast.error(error instanceof Error ? error.message : t("common.error"));
    } finally {
      setIsScanning(false);
    }
  };

  const handleSave = async () => {
    if (!scanResult) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vui lòng đăng nhập");
        return;
      }

      // Find or create category ID
      const categoryId = await db.getCategoryIdByName(
        scanResult.category,
        "expense",
        user.id,
      );

      await db.addTransaction({
        user_id: user.id,
        amount: scanResult.amount,
        type: "expense",
        category_id: categoryId,
        note: scanResult.note,
        date: scanResult.date,
      });

      toast.success(t("common.success"));
      setIsConfirmOpen(false);
      setSelectedImage(null);
      setScanResult(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Save scanned transaction error:", error);
      toast.error(t("common.error"));
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg border-primary/20 hover:bg-primary/5 text-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
        >
          {isScanning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Receipt className="mr-2 h-4 w-4" />
          )}
          {isScanning ? t("common.scanning") : t("common.scanBill")}
        </Button>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("common.uploadBill")}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border">
              <Image
                src={selectedImage}
                alt="Selected Bill"
                fill
                className="object-contain"
              />
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
              className="rounded-xl"
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={startScan} className="rounded-xl">
              {t("common.scanBill")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận giao dịch</DialogTitle>
          </DialogHeader>
          {scanResult && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t("common.amount")}</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={scanResult.amount}
                    onChange={(e) =>
                      setScanResult({
                        ...scanResult,
                        amount: Number(e.target.value),
                      })
                    }
                    className="h-11 rounded-xl text-lg font-bold pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                    ₫
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("common.category")}</Label>
                  <Input
                    value={scanResult.category}
                    onChange={(e) =>
                      setScanResult({ ...scanResult, category: e.target.value })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("common.date")}</Label>
                  <Input
                    type="date"
                    value={scanResult.date}
                    onChange={(e) =>
                      setScanResult({ ...scanResult, date: e.target.value })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("common.note")}</Label>
                <Input
                  value={scanResult.note}
                  onChange={(e) =>
                    setScanResult({ ...scanResult, note: e.target.value })
                  }
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="rounded-xl"
            >
              <X className="mr-2 h-4 w-4" />
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSave} className="rounded-xl">
              <Check className="mr-2 h-4 w-4" />
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

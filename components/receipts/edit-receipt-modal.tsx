"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type EditReceiptModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  receipt: {
    id: string;
    store_name: string;
    total: number;
    date: string;
  };
};

export function EditReceiptModal({
  open,
  onClose,
  onSuccess,
  receipt,
}: EditReceiptModalProps) {
  const [store_name, setStore] = useState(receipt.store_name);
  const [total, setTotal] = useState(receipt.total.toFixed(2));
  const [date, setDate] = useState(receipt.date.slice(0, 10)); // ISO formāts YYYY-MM-DD

  const supabase = createClient();

  useEffect(() => {
    if (open) {
      setStore(receipt.store_name);
      setTotal(receipt.total.toFixed(2));
      setDate(receipt.date.slice(0, 10));
    }
  }, [open, receipt]);

  const handleSave = async () => {
    const totalValue = parseFloat(total);
    if (isNaN(totalValue)) {
      toast.error("Nederīga summa");
      return;
    }

    const { error } = await supabase
      .from("receipts")
      .update({
        store_name,
        total: totalValue,
        date,
      })
      .eq("id", receipt.id);

    if (error) {
      toast.error("Kļūda saglabājot: " + error.message);
    } else {
      toast.success("Čeks veiksmīgi atjaunināts");
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rediģēt čeku</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            value={store_name}
            onChange={(e) => setStore(e.target.value)}
            placeholder="Veikals"
          />
          <Input
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="Kopējā summa"
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Atcelt
          </Button>
          <Button onClick={handleSave}>Saglabāt</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

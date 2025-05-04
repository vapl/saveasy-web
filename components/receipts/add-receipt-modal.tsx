"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddReceiptForm } from "./add-receipt-form";

export function AddReceiptModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pievienot jaunu čeku</DialogTitle>
        </DialogHeader>
        <AddReceiptForm
          onSuccess={() => {
            onClose();
            if (onSuccess) onSuccess();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

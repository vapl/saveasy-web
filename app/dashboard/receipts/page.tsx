"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { AddReceiptModal } from "@/components/receipts/add-receipt-modal";
import { toast } from "sonner";
import { ReceiptCard } from "@/components/receipts/receipt-card";
import { EditReceiptModal } from "@/components/receipts/edit-receipt-modal";
import { extractTextFromImage } from "@/lib/api/extractText";

type Receipt = {
  id: string;
  store_name: string;
  image_url: string;
  total: number;
  date: string;
};

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);

  const supabase = createClient();

  const fetchReceipts = async () => {
    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Kļūda ielādējot čekus:", error);
    } else {
      setReceipts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("receipts").delete().eq("id", id);
    if (error) {
      toast.error("Kļūda dzēšot: " + error.message);
    } else {
      fetchReceipts();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mani čeki</h1>
        <Button onClick={() => setModalOpen(true)}>Pievienot jaunu</Button>
      </div>

      <AddReceiptModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchReceipts}
      />

      {editingReceipt && (
        <EditReceiptModal
          open={true}
          onClose={() => setEditingReceipt(null)}
          onSuccess={fetchReceipts}
          receipt={editingReceipt}
        />
      )}

      {loading ? (
        <div className="text-muted-foreground">Notiek ielāde...</div>
      ) : receipts.length === 0 ? (
        <div className="rounded-lg border p-4 text-muted-foreground">
          Nav čeku datu. Pievieno pirmo čeku!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {receipts.map((receipt) => (
            <>
              <ReceiptCard
                key={receipt.id}
                id={receipt.id}
                store_name={receipt.store_name}
                total={receipt.total}
                date={receipt.date}
                image_url={receipt.image_url}
                onDelete={handleDelete}
                onEdit={(id) => {
                  const target = receipts.find((r) => r.id === id);
                  if (target) setEditingReceipt(target);
                }}
              />
              <Button
                variant="outline"
                onClick={async () => {
                  const text = await extractTextFromImage(receipt.image_url);
                  if (text) {
                    toast.success("OCR rezultāts iegūts");
                    console.log("OCR TEXT:", text); // pagaidām konsolē
                  } else {
                    toast.error("Neizdevās nolasīt tekstu no čeka");
                  }
                }}
              >
                OCR tests
              </Button>
            </>
          ))}
        </div>
      )}
    </div>
  );
}

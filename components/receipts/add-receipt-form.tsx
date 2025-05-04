"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export function AddReceiptForm({ onSuccess }: { onSuccess?: () => void }) {
  const [storeName, setStoreName] = useState("");
  const [total, setTotal] = useState("");
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;

    if (!user_id) {
      toast.error("Nav autentificēts lietotājs!");
      setLoading(false);
      return;
    }

    let image_url = null;

    // ja ir bilde, augšupielādē to
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user_id}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(filePath, imageFile);

      if (uploadError) {
        toast.error("Kļūda augšupielādējot attēlu: " + uploadError.message);
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("receipts").getPublicUrl(filePath);

      image_url = publicUrl;
    }

    // pievieno ierakstu datubāzē
    const { error } = await supabase.from("receipts").insert([
      {
        store_name: storeName,
        total: parseFloat(total),
        date,
        user_id,
        image_url,
      },
    ]);

    setLoading(false);

    if (error) {
      toast.error("Kļūda: " + error.message);
    } else {
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder="Veikals (piem. Rimi)"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        required
      />
      <Input
        placeholder="Summa (€)"
        type="number"
        value={total}
        onChange={(e) => setTotal(e.target.value)}
        required
      />
      <Input
        placeholder="Datums"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <Input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
          }
        }}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saglabā..." : "Pievienot čeku"}
      </Button>
    </form>
  );
}

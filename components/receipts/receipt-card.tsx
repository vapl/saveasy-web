import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreVertical,
  Pencil,
  Trash2,
  FileText,
  ImageIcon,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";

type ReceiptCardProps = {
  id: string;
  store_name: string;
  total: number;
  date: string;
  image_url: string;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
};

export function ReceiptCard({
  id,
  store_name,
  total,
  date,
  image_url,
  onDelete,
  onEdit,
}: ReceiptCardProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const isPdf = image_url.toLowerCase().endsWith(".pdf");
  const FileIcon = isPdf ? FileText : ImageIcon;

  return (
    <>
      <div className="rounded-lg border p-4 flex justify-between items-center hover:bg-muted/50 transition">
        <div className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <FileIcon
              className="w-8 h-8 text-muted-foreground cursor-pointer group-hover:hidden"
              onClick={() => setPreviewOpen(true)}
            />
            <ZoomIn
              className="w-8 h-8 text-muted-foreground cursor-pointer absolute inset-0 hidden group-hover:block"
              onClick={() => setPreviewOpen(true)}
            />
          </div>
          <div>
            <div className="font-medium">{store_name}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(date).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-semibold">€{total.toFixed(2)}</div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Pencil className="w-4 h-4" /> Rediģēt
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => setDialogOpen(true)}
                className="flex items-center gap-2 cursor-pointer text-red-600"
              >
                <Trash2 className="w-4 h-4 text-red-600" /> Dzēst
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dzēšanas apstiprinājums */}
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apstiprini dzēšanu</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Vai tiešām vēlies dzēst šo čeku?</p>
          <AlertDialogFooter>
            <AlertDialogCancel>Atcelt</AlertDialogCancel>
            <Button variant="destructive" onClick={() => onDelete(id)}>
              Dzēst
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pilnekrāna priekšskatījums */}
      <Dialog open={isPreviewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          {isPdf ? (
            <embed
              src={image_url}
              type="application/pdf"
              className="w-full h-[80vh]"
            />
          ) : (
            <Image
              src={image_url}
              alt="Čeka attēls"
              width={1200}
              height={1600}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

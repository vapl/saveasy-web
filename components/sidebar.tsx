"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Wallet,
  Settings,
  X,
} from "lucide-react";

const navItems = [
  { name: "Čeki", href: "/dashboard/receipts", icon: Receipt },
  { name: "Budžets", href: "/dashboard/budget", icon: PieChart },
  { name: "Analīze", href: "/dashboard/analytics", icon: LayoutDashboard },
  { name: "Parādi", href: "/dashboard/debts", icon: Wallet },
  { name: "Iestatījumi", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobilais backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 top-0 left-0 min-h-screen w-64 bg-background border-r transition-transform md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobilā galvene */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <span className="font-bold text-lg">Saveasy</span>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop virsraksts */}
        <div className="hidden md:block px-4 py-6 font-bold text-xl">
          Saveasy
        </div>

        {/* Navigācija */}
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm font-medium",
                pathname === href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
              onClick={onClose} // Aizver drawer uzspiežot uz linka
            >
              <Icon className="w-4 h-4" />
              {name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

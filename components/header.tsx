"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      {/* Hamburger poga – tikai mobilajā */}
      <button onClick={onMenuClick} className="md:hidden">
        <Menu className="w-6 h-6" />
      </button>

      <div className="text-lg font-semibold hidden md:block">Sākums</div>

      <div>
        {/* Theme toggle ikona labajā pusē */}
        <ThemeToggle />
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          title="Iziet"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}

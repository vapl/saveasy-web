"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="p-6">Saturs te</div>
    </div>
  );
}

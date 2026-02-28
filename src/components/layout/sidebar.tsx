"use client";

import { SidebarContent } from "./sidebar-content";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r bg-card lg:block">
      <SidebarContent />
    </aside>
  );
}

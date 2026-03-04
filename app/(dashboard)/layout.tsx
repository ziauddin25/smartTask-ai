"use client"

import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header";
import {
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar className="w-64" />
        <div className="flex-1 flex flex-col">
          <SiteHeader />
          <div className="flex-1 p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

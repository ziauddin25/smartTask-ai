import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { TasksProvider } from "@/contexts/TasksContext";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
    <TasksProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          variant="inset"
          className="w-64 flex-shrink-0 sticky top-0 h-screen"
        />
        <SidebarInset className="flex-1 w-full min-h-screen">
          <SiteHeader />
          <div className="p-6">
            {children}
          </div>
        </SidebarInset>
      </div>
      </TasksProvider>
    </SidebarProvider>
  );
}

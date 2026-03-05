"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StatsBar } from "@/components/dashboard/StatsBar"
import { AIInsightCard } from "@/components/dashboard/AIInsightCard"
import { TodayFocus } from "@/components/dashboard/TodayFocus"
import { KanbanBoard } from "@/components/dashboard/KanbanBoard"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { QuickAddTask } from "@/components/dashboard/QuickAddTask"
import { Toaster } from "@/components/ui/sonner"

export default function DashboardPage() {
  const [isQuickAddOpen, setIsQuickAddOpen] = React.useState(false)

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6">
      <StatsBar />
      <AIInsightCard />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <TodayFocus />
          <KanbanBoard />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity />
        </div>
      </div>
      
      <Button 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700"
        size="icon"
        onClick={() => setIsQuickAddOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
      
      <QuickAddTask
        open={isQuickAddOpen}
        onOpenChange={setIsQuickAddOpen}
      />
      
      <Toaster />
    </div>
  )
}

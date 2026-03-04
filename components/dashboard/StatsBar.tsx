"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, Target, AlertCircle, TrendingUp } from "lucide-react"
import { useTasks } from "@/hooks/useTasks"
import { useCountUp } from "@/hooks/useCountUp"
import { Progress } from "@/components/ui/progress"

export function StatsBar() {
  const { tasks, overdueTasks, completedToday, productivityScore } = useTasks()
  
  const totalTasks = tasks.length
  const completedTodayCount = completedToday.length
  const overdueCount = overdueTasks.length
  const productivity = productivityScore

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Tasks"
        value={totalTasks}
        icon={CheckSquare}
        trend="12% from last week"
        trendUp
      />
      <StatsCard
        title="Completed Today"
        value={completedTodayCount}
        icon={Target}
      >
        <Progress value={(completedTodayCount / (totalTasks || 1)) * 100} className="h-2 mt-2" />
      </StatsCard>
      <StatsCard
        title="Overdue Tasks"
        value={overdueCount}
        icon={AlertCircle}
        danger={overdueCount > 0}
      />
      <StatsCard
        title="Productivity"
        value={productivity}
        icon={TrendingUp}
        suffix="%"
        color="purple"
      >
        <Progress value={productivity} className="h-2 mt-2" />
      </StatsCard>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: number
  icon: React.ElementType
  trend?: string
  trendUp?: boolean
  danger?: boolean
  color?: "purple"
  children?: React.ReactNode
  suffix?: string
}

function StatsCard({ title, value, icon: Icon, trend, trendUp, danger, color, children, suffix }: StatsCardProps) {
  const animatedValue = useCountUp(value, 1000)

  return (
    <Card className={danger ? "border-red-500/50" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${danger ? "text-red-500" : color === "purple" ? "text-purple-500" : ""}`}>
              {animatedValue}{suffix || ""}
            </p>
          </div>
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
            danger 
              ? "bg-red-500/10" 
              : color === "purple" 
                ? "bg-purple-500/10"
                : "bg-primary/10"
          }`}>
            <Icon className={`h-6 w-6 ${danger ? "text-red-500" : color === "purple" ? "text-purple-500" : "text-primary"}`} />
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${trendUp ? "text-green-500" : "text-muted-foreground"}`}>
            {trendUp && <TrendingUp className="h-4 w-4" />}
            <span>{trend}</span>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  )
}

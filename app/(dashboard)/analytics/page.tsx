"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp,
  Calendar,
  Flame,
  BarChart3,
} from "lucide-react"
import { weeklyData, users, tasks, productivityHeatmap } from "@/data/mockData"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = React.useState("7d")

  const totalCompleted = weeklyData.reduce((acc, d) => acc + d.completed, 0)
  const avgPerDay = Math.round(totalCompleted / 7)
  const bestDay = weeklyData.reduce((best, d) => d.completed > best.completed ? d : best, weeklyData[0])
  const currentStreak = 5

  const categoryData = [
    { name: "Work", value: 45, color: "#7C3AED" },
    { name: "Personal", value: 25, color: "#3B82F6" },
    { name: "Learning", value: 15, color: "#10B981" },
    { name: "Health", value: 10, color: "#F59E0B" },
    { name: "Urgent", value: 5, color: "#EF4444" },
  ]

  const maxHeatmapValue = Math.max(...productivityHeatmap.flat())

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your productivity and team performance</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Completed</p>
                <p className="text-2xl font-bold">{totalCompleted}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Per Day</p>
                <p className="text-2xl font-bold">{avgPerDay}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Best Day</p>
                <p className="text-2xl font-bold">{bestDay.day}</p>
                <p className="text-xs text-muted-foreground">{bestDay.completed} tasks</p>
              </div>
              <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{currentStreak} days</p>
              </div>
              <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-end justify-between gap-2">
            {weeklyData.map((data, index) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 h-[250px]">
                  <div 
                    className="flex-1 bg-purple-500 rounded-t transition-all hover:bg-purple-600"
                    style={{ height: `${(data.completed / 20) * 100}%` }}
                    title={`Completed: ${data.completed}`}
                  />
                  <div 
                    className="flex-1 bg-blue-400 rounded-t transition-all hover:bg-blue-500"
                    style={{ height: `${(data.created / 20) * 100}%` }}
                    title={`Created: ${data.created}`}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-purple-500 rounded" />
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-blue-400 rounded" />
              <span className="text-sm">Created</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="font-medium">{category.value}%</span>
                  </div>
                  <Progress 
                    value={category.value} 
                    className="h-3"
                    style={{ 
                      ["--progress-background" as any]: category.color 
                    } as any}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 4).map((user) => {
                const productivity = Math.floor(Math.random() * 30) + 60
                return (
                  <div key={user.id} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{user.name}</span>
                        <span className="text-sm text-muted-foreground">{productivity}%</span>
                      </div>
                      <Progress value={productivity} className="h-2" />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Productivity Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Week Labels */}
            <div className="flex gap-1 ml-8">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="flex-1 text-center text-xs text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            {/* Heatmap Grid */}
            {productivityHeatmap.map((week, weekIndex) => (
              <div key={weekIndex} className="flex items-center gap-1">
                <span className="w-8 text-xs text-muted-foreground">
                  Week {weekIndex + 1}
                </span>
                {week.map((value, dayIndex) => {
                  const intensity = maxHeatmapValue > 0 ? value / maxHeatmapValue : 0
                  const bgColor = intensity === 0 
                    ? "bg-muted" 
                    : `rgba(124, 58, 237, ${Math.max(0.2, intensity)})`
                  return (
                    <div
                      key={dayIndex}
                      className={`flex-1 h-8 rounded ${bgColor} transition-colors cursor-pointer hover:opacity-80`}
                      title={`${value} tasks`}
                    />
                  )
                })}
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="text-xs text-muted-foreground">Less</span>
              <div className="flex gap-1">
                <div className="h-4 w-4 rounded bg-muted" />
                <div className="h-4 w-4 rounded bg-purple-300" />
                <div className="h-4 w-4 rounded bg-purple-500" />
                <div className="h-4 w-4 rounded bg-purple-700" />
                <div className="h-4 w-4 rounded bg-purple-900" />
              </div>
              <span className="text-xs text-muted-foreground">More</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

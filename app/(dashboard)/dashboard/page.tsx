"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  CheckSquare, 
  TrendingUp, 
  AlertCircle, 
  Target,
  Sparkles,
  Plus,
  MessageSquare,
  Paperclip,
  MoreVertical,
  Calendar,
  ArrowUp,
  ArrowDown,
  Flame,
  Clock,
} from "lucide-react"
import { tasks, projects, recentActivity, aiInsights, weeklyData, currentUser } from "@/data/mockData"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  const [aiInsightIndex, setAiInsightIndex] = React.useState(0)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [newTask, setNewTask] = React.useState({
    title: "",
    description: "",
    priority: "medium",
    category: "work",
    deadline: "",
  })

  // Rotate AI insights every 10 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setAiInsightIndex((prev) => (prev + 1) % aiInsights.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Calculate stats
  const totalTasks = tasks.length
  const completedToday = tasks.filter(t => t.status === "done").length
  const overdueTasks = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== "done").length
  const productivityScore = Math.round((completedToday / totalTasks) * 100)

  // Get today's focus tasks (AI-recommended)
  const todayFocusTasks = tasks
    .filter(t => t.status !== "done")
    .sort((a, b) => {
      if (a.isAISuggested && !b.isAISuggested) return -1
      if (!a.isAISuggested && b.isAISuggested) return 1
      return 0
    })
    .slice(0, 3)

  // Group tasks by status
  const todoTasks = tasks.filter(t => t.status === "todo")
  const inProgressTasks = tasks.filter(t => t.status === "inprogress")
  const doneTasks = tasks.filter(t => t.status === "done")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-slate"
      case "inprogress": return "bg-blue"
      case "done": return "bg-green"
      default: return "bg-gray"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work": return "bg-indigo-500"
      case "personal": return "bg-pink-500"
      case "urgent": return "bg-red-500"
      case "learning": return "bg-purple-500"
      case "health": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const completedThisWeek = weeklyData.reduce((acc, d) => acc + d.completed, 0)
  const createdThisWeek = weeklyData.reduce((acc, d) => acc + d.created, 0)

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
              <ArrowUp className="h-4 w-4" />
              <span>12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">{completedToday}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={(completedToday / totalTasks) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Tasks</p>
                <p className="text-2xl font-bold">{overdueTasks}</p>
              </div>
              <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            {overdueTasks > 0 && (
              <Badge variant="destructive" className="mt-2">Action needed</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Productivity</p>
                <p className="text-2xl font-bold">{productivityScore}%</p>
              </div>
              <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <Progress value={productivityScore} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* AI Insight Card */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-lg">AI Insight</p>
                <p className="text-white/80">{aiInsights[aiInsightIndex].message}</p>
              </div>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/20">
              Ask AI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Today Focus & Kanban */}
        <div className="lg:col-span-3 space-y-6">
          {/* Today Focus */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today&apos;s Focus ✨</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayFocusTasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                >
                  <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{task.title}</span>
                      {task.isAISuggested && (
                        <Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {task.deadline}
                      </span>
                    </div>
                  </div>
                  <AvatarGroup max={3} className="flex-shrink-0">
                    {task.assignees.map((user) => (
                      <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Kanban Board */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tasks Board</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {/* Todo Column */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">To Do</h3>
                    <Badge variant="secondary">{todoTasks.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {todoTasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-sm line-clamp-2">{task.title}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className={`text-[10px] ${getPriorityColor(task.priority)} text-white`}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] ${getCategoryColor(task.category)} text-white`}>
                            {task.category}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {task.commentCount > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />{task.commentCount}
                              </span>
                            )}
                            {task.attachmentCount > 0 && (
                              <span className="flex items-center gap-1">
                                <Paperclip className="h-3 w-3" />{task.attachmentCount}
                              </span>
                            )}
                          </div>
                          <AvatarGroup max={2} className="scale-75">
                            {task.assignees.map((user) => (
                              <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                              </Avatar>
                            ))}
                          </AvatarGroup>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">In Progress</h3>
                    <Badge variant="secondary">{inProgressTasks.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {inProgressTasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-sm line-clamp-2">{task.title}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className={`text-[10px] ${getPriorityColor(task.priority)} text-white`}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] ${getCategoryColor(task.category)} text-white`}>
                            {task.category}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {task.commentCount > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />{task.commentCount}
                              </span>
                            )}
                          </div>
                          <AvatarGroup max={2} className="scale-75">
                            {task.assignees.map((user) => (
                              <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                              </Avatar>
                            ))}
                          </AvatarGroup>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Done Column */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Done</h3>
                    <Badge variant="secondary">{doneTasks.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {doneTasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="p-3 rounded-lg border bg-muted/30 hover:shadow-md transition-shadow cursor-pointer opacity-75">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-sm line-clamp-2 line-through">{task.title}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-[10px] bg-green-500/20 text-green-500">
                            Done
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity & Quick Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user.name}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.timeAgo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">Streak</span>
                </div>
                <span className="font-bold">5 days 🔥</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-green-500" />
                  <span className="text-sm">This Week</span>
                </div>
                <span className="font-bold">{completedThisWeek} completed</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Created</span>
                </div>
                <span className="font-bold">{createdThisWeek} tasks</span>
              </div>
              <Progress value={(completedThisWeek / createdThisWeek) * 100} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                {completedThisWeek} of {createdThisWeek} tasks completed this week
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 bg-black h-10 w-10 cursor-pointer rounded-full shadow-lg"
            size="icon"
          >
            <Plus size={40} className="text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] z-999 bg-white">
          <DialogHeader>
            <DialogTitle>Quick Add Task</DialogTitle>
            <DialogDescription>
              Create a new task quickly
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select 
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select 
                  value={newTask.category}
                  onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsDialogOpen(false)}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

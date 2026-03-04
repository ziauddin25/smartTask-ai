"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarGroup, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { CheckSquare, Calendar, Sparkles, ChevronRight } from "lucide-react"
import { useTasks } from "@/hooks/useTasks"
import { Task } from "@/types"
import { TaskDetailModal } from "./TaskDetailModal"
import { formatDistanceToNow, isPast, differenceInDays } from "date-fns"
import { toast } from "sonner"

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high": return "bg-red-500"
    case "medium": return "bg-yellow-500"
    case "low": return "bg-green-500"
    default: return "bg-gray-500"
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "work": return "bg-indigo-500"
    case "personal": return "bg-pink-500"
    case "urgent": return "bg-red-500"
    case "learning": return "bg-purple-500"
    case "health": return "bg-green-500"
    default: return "bg-gray-500"
  }
}

function formatDeadline(deadline: string): { text: string; isOverdue: boolean } {
  const deadlineDate = new Date(deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadlineDate.setHours(0, 0, 0, 0)
  
  const isOverdue = isPast(deadlineDate)
  const daysDiff = differenceInDays(deadlineDate, today)
  
  let text: string
  if (daysDiff === 0) {
    text = "Due today"
  } else if (daysDiff === 1) {
    text = "Due tomorrow"
  } else if (daysDiff === -1) {
    text = "Overdue by 1 day"
  } else if (isOverdue) {
    text = `Overdue by ${Math.abs(daysDiff)} days`
  } else {
    text = `Due in ${daysDiff} days`
  }
  
  return { text, isOverdue }
}

interface TodayTaskCardProps {
  task: Task
  onComplete: () => void
  onViewDetails: () => void
}

function TodayTaskCard({ task, onComplete, onViewDetails }: TodayTaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const { completeTask } = useTasks()
  const deadlineInfo = formatDeadline(task.deadline)

  const handleComplete = () => {
    setIsCompleting(true)
    setTimeout(() => {
      completeTask(task.id)
      toast.success("Task completed! 🎉")
    }, 500)
  }

  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer ${
        isCompleting ? "opacity-50 scale-95 transition-all" : ""
      }`}
    >
      <Button 
        size="icon" 
        variant="outline" 
        className="h-8 w-8 rounded-full hover:bg-green-500 hover:text-white hover:border-green-500"
        onClick={handleComplete}
        aria-label="Complete task"
      >
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
          <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-white text-[10px]`}>
            {task.priority}
          </Badge>
          <Badge variant="outline" className={`${getCategoryColor(task.category)} text-white text-[10px]`}>
            {task.category}
          </Badge>
          <span className={`flex items-center gap-1 ${deadlineInfo.isOverdue ? "text-red-500" : ""}`}>
            <Calendar className="h-3 w-3" />
            {deadlineInfo.text}
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
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex-shrink-0"
        onClick={onViewDetails}
      >
        Details
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  )
}

export function TodayFocus() {
  const { todaysFocus } = useTasks()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleComplete = (taskId: string) => {
    const task = todaysFocus.find(t => t.id === taskId)
    if (task) {
      setSelectedTask(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today&apos;s Focus ✨</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todaysFocus.length === 0 ? (
            <p className="text-muted-foreground text-sm">No tasks to focus on. Add some tasks!</p>
          ) : (
            todaysFocus.map((task) => (
              <TodayTaskCard
                key={task.id}
                task={task}
                onComplete={() => handleComplete(task.id)}
                onViewDetails={() => setSelectedTask(task)}
              />
            ))
          )}
        </CardContent>
      </Card>

      <TaskDetailModal
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </>
  )
}

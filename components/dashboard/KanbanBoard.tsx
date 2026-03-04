"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarGroup, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MoreVertical, MessageSquare, Paperclip, Sparkles, Plus, Edit, Trash2, CheckCircle } from "lucide-react"
import { Task } from "@/types"
import { useTasks } from "@/hooks/useTasks"
import { TaskDetailModal } from "./TaskDetailModal"
import { QuickAddTask } from "./QuickAddTask"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { isPast, differenceInDays } from "date-fns"
import { toast } from "sonner"

interface KanbanBoardProps {
  onTaskSelect?: (task: Task) => void
}

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

function isOverdue(deadline: string): boolean {
  const deadlineDate = new Date(deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadlineDate.setHours(0, 0, 0, 0)
  return isPast(deadlineDate)
}

interface TaskCardProps {
  task: Task
  index: number
  onComplete: () => void
  onDelete: () => void
  onEdit: () => void
  onViewDetails: () => void
}

function TaskCard({ task, index, onComplete, onDelete, onEdit, onViewDetails }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer ${
            snapshot.isDragging ? "shadow-lg rotate-2" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onViewDetails}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="font-medium text-sm line-clamp-2">{task.title}</span>
            {task.isAISuggested && (
              <Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0" />
            )}
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={`text-[10px] ${getPriorityColor(task.priority)} text-white`}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={`text-[10px] ${getCategoryColor(task.category)} text-white`}>
              {task.category}
            </Badge>
          </div>
          
          <div className={`flex items-center justify-between mt-3 ${isOverdue(task.deadline) && task.status !== "done" ? "text-red-500" : "text-muted-foreground"}`}>
            <div className="flex items-center gap-1 text-xs">
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
            <span className="text-xs">{task.deadline}</span>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <AvatarGroup max={2} className="scale-75 -ml-2">
              {task.assignees.map((user) => (
                <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            
            {isHovered && (
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={onEdit}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 hover:bg-green-500 hover:text-white"
                  onClick={onComplete}
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-red-500 hover:text-white">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    </AlertDialogHeader>
                    <p>Are you sure you want to delete "{task.title}"? This action can be undone for 5 seconds.</p>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

export function KanbanBoard({ onTaskSelect }: KanbanBoardProps) {
  const { tasks, moveTask, completeTask, deleteTask } = useTasks()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [addTaskStatus, setAddTaskStatus] = useState<Task["status"] | null>(null)

  const columns: { id: Task["status"]; title: string }[] = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "done", title: "Done" },
  ]

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === result.source.droppableId &&
      destination.index === result.source.index
    ) {
      return
    }

    const newStatus = destination.droppableId as Task["status"]
    moveTask(draggableId, newStatus)
    
    if (newStatus === "done") {
      toast.success("Task moved to Done")
    } else {
      toast.info(`Task moved to ${columns.find(c => c.id === newStatus)?.title}`)
    }
  }

  const handleComplete = (taskId: string) => {
    completeTask(taskId)
    toast.success("Task completed! 🎉")
  }

  const handleDelete = (taskId: string) => {
    deleteTask(taskId)
    toast.warning("Task deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          // This will be handled by the context
        },
      },
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tasks Board</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-3 gap-4">
              {columns.map((column) => (
                <div key={column.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <Badge variant="secondary">{getTasksByStatus(column.id).length}</Badge>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-2 min-h-[200px] p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? "bg-muted/50" : ""
                        }`}
                      >
                        {getTasksByStatus(column.id).map((task, index) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            index={index}
                            onComplete={() => handleComplete(task.id)}
                            onDelete={() => handleDelete(task.id)}
                            onEdit={() => setEditingTask(task)}
                            onViewDetails={() => setSelectedTask(task)}
                          />
                        ))}
                        {provided.placeholder}
                        
                        <Button
                          variant="ghost"
                          className="w-full text-muted-foreground text-sm justify-start"
                          onClick={() => setAddTaskStatus(column.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </CardContent>
      </Card>

      <TaskDetailModal
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />

      <QuickAddTask
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        editingTask={editingTask}
      />

      <QuickAddTask
        open={!!addTaskStatus}
        onOpenChange={(open) => !open && setAddTaskStatus(null)}
        defaultStatus={addTaskStatus || undefined}
      />
    </>
  )
}

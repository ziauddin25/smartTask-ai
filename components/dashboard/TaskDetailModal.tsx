"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CheckSquare, Calendar, MessageSquare, Send, Sparkles, Clock, User } from "lucide-react"
import { Task } from "@/types"
import { useTasks } from "@/hooks/useTasks"
import { users } from "@/data/mockData"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface TaskDetailModalProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function TaskDetailModal({ task, open, onOpenChange }: TaskDetailModalProps) {
  const { updateTask, addComment, getTaskComments, moveTask } = useTasks()
  const [editedTitle, setEditedTitle] = useState("")
  const [editedDescription, setEditedDescription] = useState("")
  const [newComment, setNewComment] = useState("")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [taskStatus, setTaskStatus] = useState<Task["status"]>("todo")
  const [taskPriority, setTaskPriority] = useState<Task["priority"]>("medium")
  const [taskCategory, setTaskCategory] = useState<Task["category"]>("work")
  const [taskDeadline, setTaskDeadline] = useState("")

  const comments = task ? getTaskComments(task.id) : []

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title)
      setEditedDescription(task.description)
      setTaskStatus(task.status)
      setTaskPriority(task.priority)
      setTaskCategory(task.category)
      setTaskDeadline(task.deadline)
    }
  }, [task])

  if (!task) return null

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      updateTask(task.id, { title: editedTitle.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleSaveDescription = () => {
    if (editedDescription !== task.description) {
      updateTask(task.id, { description: editedDescription })
    }
    setIsEditingDescription(false)
  }

  const handleStatusChange = (status: string) => {
    const newStatus = status as Task["status"]
    setTaskStatus(newStatus)
    updateTask(task.id, { status: newStatus })
    toast.info(`Task moved to ${status}`)
  }

  const handlePriorityChange = (priority: string) => {
    const newPriority = priority as Task["priority"]
    setTaskPriority(newPriority)
    updateTask(task.id, { priority: newPriority })
  }

  const handleCategoryChange = (category: string) => {
    const newCategory = category as Task["category"]
    setTaskCategory(newCategory)
    updateTask(task.id, { category: newCategory })
  }

  const handleDeadlineChange = (deadline: string) => {
    setTaskDeadline(deadline)
    updateTask(task.id, { deadline })
  }

  const handleAssigneesChange = (userIds: string) => {
    const selectedUsers = users.filter(u => u.id === userIds)
    updateTask(task.id, { assignees: selectedUsers })
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(task.id, newComment.trim())
      setNewComment("")
      toast.success("Comment added")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task.isAISuggested && <Sparkles className="h-5 w-5 text-purple-500" />}
            Task Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            {isEditingTitle ? (
              <div className="flex gap-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                  autoFocus
                />
                <Button onClick={handleSaveTitle} size="sm">Save</Button>
              </div>
            ) : (
              <div 
                className="text-lg font-medium cursor-pointer hover:bg-muted p-2 rounded"
                onClick={() => setIsEditingTitle(true)}
              >
                {task.title}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            {isEditingDescription ? (
              <div className="flex gap-2">
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleSaveDescription} size="sm">Save</Button>
              </div>
            ) : (
              <div 
                className="text-sm text-muted-foreground cursor-pointer hover:bg-muted p-2 rounded"
                onClick={() => setIsEditingDescription(true)}
              >
                {task.description || "No description"}
              </div>
            )}
          </div>

          {/* Status & Priority & Category */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={taskStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={taskPriority} onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={taskCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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

          {/* Deadline */}
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={taskDeadline}
              onChange={(e) => handleDeadlineChange(e.target.value)}
            />
          </div>

          {/* Assignees */}
          <div className="space-y-2">
            <Label>Assignees</Label>
            <Select 
              value={task.assignees[0]?.id || ""} 
              onValueChange={handleAssigneesChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {task.assignees.length > 0 && (
              <div className="flex gap-2 mt-2">
                {task.assignees.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Suggested */}
          <div className="flex items-center gap-2">
            <Sparkles className={`h-4 w-4 ${task.isAISuggested ? "text-purple-500" : "text-muted"}`} />
            <span className="text-sm text-muted-foreground">
              {task.isAISuggested ? "AI Suggested" : "Not AI Suggested"}
            </span>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments ({comments.length})
            </h3>
            
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <Button onClick={handleAddComment} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="border-t pt-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Activity
            </h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Created on {task.createdAt}</span>
              </div>
              {task.completedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckSquare className="h-3 w-3" />
                  <span>Completed {task.completedAt}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

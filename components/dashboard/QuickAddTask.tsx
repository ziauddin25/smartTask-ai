"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Task } from "@/types"
import { useTasks } from "@/hooks/useTasks"
import { users } from "@/data/mockData"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Sparkles, CheckCircle } from "lucide-react"

interface QuickAddTaskProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingTask?: Task | null
  defaultStatus?: Task["status"]
}

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]),
  category: z.enum(["work", "personal", "urgent", "learning", "health"]),
  deadline: z.string().min(1, "Deadline is required"),
  assigneeId: z.string().optional(),
  isAISuggested: z.boolean().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

function parseNaturalLanguage(text: string): Partial<TaskFormData> {
  const lowerText = text.toLowerCase()
  const result: Partial<TaskFormData> = {}
  
  const today = new Date()
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  
  if (lowerText.includes('today')) {
    result.deadline = today.toISOString().split('T')[0]
  } else if (lowerText.includes('tomorrow')) {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    result.deadline = tomorrow.toISOString().split('T')[0]
  } else if (lowerText.includes('next week')) {
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    result.deadline = nextWeek.toISOString().split('T')[0]
  } else {
    for (let i = 0; i < dayNames.length; i++) {
      if (lowerText.includes(dayNames[i])) {
        const targetDay = i
        const currentDay = today.getDay()
        let daysUntil = targetDay - currentDay
        if (daysUntil <= 0) daysUntil += 7
        const deadline = new Date(today)
        deadline.setDate(deadline.getDate() + daysUntil)
        result.deadline = deadline.toISOString().split('T')[0]
        break
      }
    }
  }
  
  if (lowerText.includes('urgent') || lowerText.includes('high priority') || lowerText.includes('important') || lowerText.includes('asap')) {
    result.priority = 'high'
  } else if (lowerText.includes('medium') || lowerText.includes('normal')) {
    result.priority = 'medium'
  } else if (lowerText.includes('low') || lowerText.includes('later')) {
    result.priority = 'low'
  }
  
  if (lowerText.includes('work') || lowerText.includes('meeting') || lowerText.includes('report') || lowerText.includes('project')) {
    result.category = 'work'
  } else if (lowerText.includes('personal') || lowerText.includes('home') || lowerText.includes('family')) {
    result.category = 'personal'
  } else if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('emergency')) {
    result.category = 'urgent'
  } else if (lowerText.includes('learn') || lowerText.includes('course') || lowerText.includes('study')) {
    result.category = 'learning'
  } else if (lowerText.includes('health') || lowerText.includes('gym') || lowerText.includes('workout') || lowerText.includes('exercise')) {
    result.category = 'health'
  }
  
  return result
}

export function QuickAddTask({ open, onOpenChange, editingTask, defaultStatus }: QuickAddTaskProps) {
  const { addTask, updateTask } = useTasks()
  const [naturalLanguageText, setNaturalLanguageText] = useState("")
  const [parsedSuccessfully, setParsedSuccessfully] = useState(false)
  const [parsedData, setParsedData] = useState<Partial<TaskFormData>>({})
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      category: "work",
      deadline: "",
      assigneeId: "",
      isAISuggested: false,
    }
  })
  
  useEffect(() => {
    if (open) {
      reset({
        title: editingTask?.title || "",
        description: editingTask?.description || "",
        priority: editingTask?.priority || "medium",
        category: editingTask?.category || "work",
        deadline: editingTask?.deadline || "",
        assigneeId: editingTask?.assignees[0]?.id || "",
        isAISuggested: editingTask?.isAISuggested || false,
      })
    }
  }, [open, editingTask, reset])
  
  const selectedPriority = watch("priority")
  const selectedCategory = watch("category")
  const selectedAssignee = watch("assigneeId")
  
  const handleParse = () => {
    if (!naturalLanguageText.trim()) {
      toast.error("Please enter some text to parse")
      return
    }
    
    const parsed = parseNaturalLanguage(naturalLanguageText)
    setParsedData(parsed)
    setParsedSuccessfully(true)
    
    if (parsed.priority) setValue("priority", parsed.priority)
    if (parsed.category) setValue("category", parsed.category)
    if (parsed.deadline) setValue("deadline", parsed.deadline)
    
    toast.success("Parsed successfully ✓")
  }
  
  const onSubmit = (data: TaskFormData) => {
    const assignee = users.find(u => u.id === data.assigneeId)
    
    if (editingTask) {
      updateTask(editingTask.id, {
        title: data.title,
        description: data.description || "",
        priority: data.priority,
        category: data.category,
        deadline: data.deadline,
        assignees: assignee ? [assignee] : [],
        isAISuggested: data.isAISuggested || false,
      })
      toast.success("Task updated successfully ✅")
    } else {
      addTask({
        title: data.title,
        description: data.description || "",
        status: defaultStatus || "todo",
        priority: data.priority,
        category: data.category,
        deadline: data.deadline,
        assignees: assignee ? [assignee] : [],
        isAISuggested: data.isAISuggested || false,
        commentCount: 0,
        attachmentCount: 0,
      })
      toast.success("Task added successfully ✅")
    }
    
    handleClose()
  }
  
  const handleClose = () => {
    reset()
    setNaturalLanguageText("")
    setParsedSuccessfully(false)
    setParsedData({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTask ? "Edit Task" : "Quick Add Task"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!editingTask && (
            <div className="space-y-2">
              <Label>Natural Language Input</Label>
              <Textarea
                placeholder="e.g. Finish the report by Friday, high priority, work category"
                value={naturalLanguageText}
                onChange={(e) => {
                  setNaturalLanguageText(e.target.value)
                  setParsedSuccessfully(false)
                }}
                rows={3}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleParse}
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Parse with AI
              </Button>
              {parsedSuccessfully && (
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Parsed successfully ✓</span>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Task title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Task description"
                {...register("description")}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select 
                  value={selectedPriority} 
                  onValueChange={(value) => setValue("priority", value as Task["priority"])}
                >
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
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value) => setValue("category", value as Task["category"])}
                >
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
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register("deadline")}
              />
              {errors.deadline && (
                <p className="text-sm text-red-500">{errors.deadline.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select 
                value={selectedAssignee} 
                onValueChange={(value) => setValue("assigneeId", value)}
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
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="isAISuggested">AI Suggested</Label>
              <Switch
                id="isAISuggested"
                checked={watch("isAISuggested")}
                onCheckedChange={(checked) => setValue("isAISuggested", checked)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

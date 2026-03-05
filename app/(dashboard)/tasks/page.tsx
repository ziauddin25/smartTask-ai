"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Filter,
  X,
  Calendar,
  MessageSquare,
  Paperclip,
  Sparkles,
} from "lucide-react"
import { tasks, projects } from "@/data/mockData"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [viewMode, setViewMode] = React.useState<"list" | "kanban">("list")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [newTask, setNewTask] = React.useState({
    title: "",
    description: "",
    priority: "medium",
    category: "work",
    deadline: "",
    assignee: "",
  })

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const todoTasks = filteredTasks.filter(t => t.status === "todo")
  const inProgressTasks = filteredTasks.filter(t => t.status === "inprogress")
  const doneTasks = filteredTasks.filter(t => t.status === "done")

  const hasActiveFilters = statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all"

  const clearFilters = () => {
    setStatusFilter("all")
    setPriorityFilter("all")
    setCategoryFilter("all")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "todo": return <Badge variant="outline">To Do</Badge>
      case "inprogress": return <Badge variant="default" className="bg-blue-500">In Progress</Badge>
      case "done": return <Badge variant="default" className="bg-green-500">Done</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your tasks</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to your list
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Category</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                </Badge>
              )}
              {priorityFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Priority: {priorityFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setPriorityFilter("all")} />
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Category: {categoryFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setCategoryFilter("all")} />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "kanban")}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          </TabsList>
          <p className="text-sm text-muted-foreground">{filteredTasks.length} tasks</p>
        </div>

        {/* List View */}
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Task</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignees</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Checkbox />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                                {task.title}
                              </span>
                              {task.isAISuggested && (
                                <Sparkles className="h-4 w-4 text-purple-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
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
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-white`}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        <AvatarGroup max={3}>
                          {task.assignees.map((user) => (
                            <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.initials}</AvatarFallback>
                            </Avatar>
                          ))}
                        </AvatarGroup>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {task.deadline}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">No tasks found</p>
                  <Button variant="link" onClick={() => setIsDialogOpen(true)}>
                    Create your first task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kanban View */}
        <TabsContent value="kanban" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Todo Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">To Do</h3>
                <Badge variant="secondary">{todoTasks.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {todoTasks.map((task) => (
                  <Card key={task.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-sm">{task.title}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={`text-[10px] ${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {task.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {task.deadline}
                      </div>
                      <AvatarGroup max={2}>
                        {task.assignees.map((user) => (
                          <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-[8px]">{user.initials}</AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">In Progress</h3>
                <Badge variant="secondary">{inProgressTasks.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {inProgressTasks.map((task) => (
                  <Card key={task.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-sm">{task.title}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={`text-[10px] ${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {task.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {task.deadline}
                      </div>
                      <AvatarGroup max={2}>
                        {task.assignees.map((user) => (
                          <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-[8px]">{user.initials}</AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Done Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">Done</h3>
                <Badge variant="secondary">{doneTasks.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {doneTasks.map((task) => (
                  <Card key={task.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow opacity-75">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-sm line-through">{task.title}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] bg-green-500/20 text-green-500">
                        Done
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

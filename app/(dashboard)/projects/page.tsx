"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Calendar,
  MoreVertical,
  FolderKanban,
  CheckSquare,
} from "lucide-react"
import { projects, users } from "@/data/mockData"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const colorOptions = [
  { value: "#7C3AED", label: "Purple" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Orange" },
  { value: "#EF4444", label: "Red" },
  { value: "#EC4899", label: "Pink" },
]

export default function ProjectsPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [newProject, setNewProject] = React.useState({
    name: "",
    description: "",
    color: "#7C3AED",
    deadline: "",
    members: [] as string[],
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="default" className="bg-green-500">Active</Badge>
      case "completed": return <Badge variant="default" className="bg-blue-500">Completed</Badge>
      case "onhold":
        return <Badge variant="secondary" className="bg-yellow-500">On Hold</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your projects and track progress</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to your workspace
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="Enter project name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={`h-8 w-8 rounded-full transition-transform ${
                        newProject.color === color.value ? "scale-110 ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNewProject({ ...newProject, color: color.value })}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsDialogOpen(false)}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
            {/* Color Bar */}
            <div 
              className="h-1 w-full" 
              style={{ backgroundColor: project.color }}
            />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {project.description}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                {getStatusBadge(project.status)}
              </div>

              {/* Members */}
              <div className="flex items-center justify-between">
                <AvatarGroup max={3}>
                  {project.members.map((user) => (
                    <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
              </div>

              {/* Task Count */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckSquare className="h-4 w-4" />
                  <span>{project.completedTaskCount}/{project.taskCount} tasks</span>
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground pt-2 border-t">
                <Calendar className="h-4 w-4" />
                <span>Due {project.deadline}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No projects yet</p>
            <Button variant="link" onClick={() => setIsDialogOpen(true)}>
              Create your first project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

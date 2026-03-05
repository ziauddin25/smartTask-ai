"use client"

import { useState, useEffect } from "react"
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSearch } from "@/hooks/useSearch"
import { Task } from "@/types"
import { CheckCircle, Circle, Clock, Folder, Search } from "lucide-react"
import { TaskDetailModal } from "./TaskDetailModal"

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  
  const { tasks, projects } = useSearch(query)
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  
  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task)
    setOpen(false)
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inprogress': return <Clock className="h-4 w-4 text-blue-500" />
      default: return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="text-muted-foreground hidden md:inline">Search</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground hidden md:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search tasks and projects..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {query ? `No results found for "${query}"` : "Type to search..."}
          </CommandEmpty>
          
          {tasks.length > 0 && (
            <CommandGroup heading="Tasks">
              {tasks.map((task) => (
                <CommandItem
                  key={task.id}
                  onSelect={() => handleTaskSelect(task)}
                  className="flex items-center gap-3"
                >
                  {getStatusIcon(task.status)}
                  <span className="flex-1">{task.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {task.status === 'done' ? 'Done' : task.status === 'inprogress' ? 'In Progress' : 'To Do'}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {projects.length > 0 && (
            <CommandGroup heading="Projects">
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  className="flex items-center gap-3"
                >
                  <Folder className="h-4 w-4" />
                  <span className="flex-1">{project.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {project.status}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
      
      <TaskDetailModal
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </>
  )
}

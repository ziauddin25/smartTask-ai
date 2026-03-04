"use client"

import { useState, useEffect, useMemo } from "react"
import { useTasksContext } from "@/contexts/TasksContext"
import { Task, Project } from "@/types"
import { projects } from "@/data/mockData"

interface SearchResults {
  tasks: Task[]
  projects: Project[]
}

export function useSearch(query: string): SearchResults {
  const { tasks } = useTasksContext()
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return { tasks: [], projects: [] }
    }

    const lowerQuery = debouncedQuery.toLowerCase()

    const filteredTasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery)
    )

    const filteredProjects = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery)
    )

    return {
      tasks: filteredTasks,
      projects: filteredProjects,
    }
  }, [debouncedQuery, tasks])

  return results
}

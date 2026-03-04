"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react"
import { Task, User, Notification, ActivityItem, Comment } from "@/types"
import { tasks as initialTasks, notifications as initialNotifications, recentActivity as initialActivity, currentUser as defaultUser, users, comments as initialComments } from "@/data/mockData"

interface TasksContextType {
  tasks: Task[]
  notifications: Notification[]
  activityLog: ActivityItem[]
  currentUser: User
  comments: Comment[]
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  completeTask: (id: string) => void
  moveTask: (id: string, newStatus: Task["status"]) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  addComment: (taskId: string, text: string) => void
  addActivity: (item: Omit<ActivityItem, "id">) => void
  getTaskComments: (taskId: string) => Comment[]
  overdueTasks: Task[]
  todaysFocus: Task[]
  completedToday: Task[]
  productivityScore: number
  deletedTask: Task | null
  undoDelete: () => void
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [activityLog, setActivityLog] = useState<ActivityItem[]>(initialActivity)
  const [currentUser] = useState<User>(defaultUser)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [deletedTask, setDeletedTask] = useState<Task | null>(null)

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setTasks((prev) => [...prev, newTask])
    addActivity({
      user: currentUser,
      action: `created "${newTask.title}"`,
      timeAgo: "Just now",
      type: "created",
    })
  }, [currentUser])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id)
    if (taskToDelete) {
      setDeletedTask(taskToDelete)
      setTasks((prev) => prev.filter((task) => task.id !== id))
      setTimeout(() => {
        setDeletedTask(null)
      }, 5000)
    }
  }, [tasks])

  const undoDelete = useCallback(() => {
    if (deletedTask) {
      setTasks((prev) => [...prev, deletedTask])
      setDeletedTask(null)
    }
  }, [deletedTask])

  const completeTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: "done" as const, completedAt: new Date().toISOString() } : task
      )
    )
    const task = tasks.find((t) => t.id === id)
    if (task) {
      addActivity({
        user: currentUser,
        action: `completed "${task.title}"`,
        timeAgo: "Just now",
        type: "completed",
      })
    }
  }, [tasks, currentUser])

  const moveTask = useCallback((id: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    )
    const task = tasks.find((t) => t.id === id)
    if (task) {
      const statusLabels: Record<Task["status"], string> = {
        todo: "To Do",
        inprogress: "In Progress",
        done: "Done",
      }
      addActivity({
        user: currentUser,
        action: `moved "${task.title}" to ${statusLabels[newStatus]}`,
        timeAgo: "Just now",
        type: "assigned",
      })
    }
  }, [tasks, currentUser])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }, [])

  const addComment = useCallback((taskId: string, text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      taskId,
      userId: currentUser.id,
      user: currentUser,
      text,
      createdAt: new Date().toISOString(),
    }
    setComments((prev) => [...prev, newComment])
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, commentCount: task.commentCount + 1 } : task
      )
    )
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      addActivity({
        user: currentUser,
        action: `commented on "${task.title}"`,
        timeAgo: "Just now",
        type: "commented",
      })
    }
  }, [currentUser, tasks])

  const addActivity = useCallback((item: Omit<ActivityItem, "id">) => {
    const newActivity: ActivityItem = {
      ...item,
      id: `activity-${Date.now()}`,
    }
    setActivityLog((prev) => [newActivity, ...prev])
  }, [])

  const getTaskComments = useCallback((taskId: string) => {
    return comments.filter((c) => c.taskId === taskId)
  }, [comments])

  const overdueTasks = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return tasks.filter((task) => {
      const deadline = new Date(task.deadline)
      deadline.setHours(0, 0, 0, 0)
      return deadline < today && task.status !== "done"
    })
  }, [tasks])

  const todaysFocus = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const incompleteTasks = tasks.filter((task) => task.status !== "done")
    
    const sorted = [...incompleteTasks].sort((a, b) => {
      const deadlineA = new Date(a.deadline)
      const deadlineB = new Date(b.deadline)
      deadlineA.setHours(0, 0, 0, 0)
      deadlineB.setHours(0, 0, 0, 0)
      
      const isOverdueA = deadlineA < today
      const isOverdueB = deadlineB < today
      
      if (isOverdueA && !isOverdueB) return -1
      if (!isOverdueA && isOverdueB) return 1
      
      if (a.priority === "high" && b.priority !== "high") return -1
      if (a.priority !== "high" && b.priority === "high") return 1
      
      return deadlineA.getTime() - deadlineB.getTime()
    })
    
    return sorted.slice(0, 3)
  }, [tasks])

  const completedToday = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return tasks.filter((task) => {
      if (task.status !== "done") return false
      if (!task.completedAt) return false
      const completedDate = new Date(task.completedAt)
      completedDate.setHours(0, 0, 0, 0)
      return completedDate.getTime() === today.getTime()
    })
  }, [tasks])

  const productivityScore = useMemo(() => {
    if (tasks.length === 0) return 0
    const completed = tasks.filter((t) => t.status === "done").length
    return Math.round((completed / tasks.length) * 100)
  }, [tasks])

  const value = {
    tasks,
    notifications,
    activityLog,
    currentUser,
    comments,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    moveTask,
    markNotificationRead,
    markAllNotificationsRead,
    addComment,
    addActivity,
    getTaskComments,
    overdueTasks,
    todaysFocus,
    completedToday,
    productivityScore,
    deletedTask,
    undoDelete,
  }

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasksContext() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error("useTasksContext must be used within a TasksProvider")
  }
  return context
}

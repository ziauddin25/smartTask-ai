"use client"

import { useTasksContext } from "@/contexts/TasksContext"
import { Task } from "@/types"

export function useTasks() {
  const context = useTasksContext()

  return {
    tasks: context.tasks,
    notifications: context.notifications,
    activityLog: context.activityLog,
    currentUser: context.currentUser,
    comments: context.comments,
    addTask: context.addTask,
    updateTask: context.updateTask,
    deleteTask: context.deleteTask,
    completeTask: context.completeTask,
    moveTask: context.moveTask,
    markNotificationRead: context.markNotificationRead,
    markAllNotificationsRead: context.markAllNotificationsRead,
    addComment: context.addComment,
    addActivity: context.addActivity,
    getTaskComments: context.getTaskComments,
    overdueTasks: context.overdueTasks,
    todaysFocus: context.todaysFocus,
    completedToday: context.completedToday,
    productivityScore: context.productivityScore,
    deletedTask: context.deletedTask,
    undoDelete: context.undoDelete,
  }
}

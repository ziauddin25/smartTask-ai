export interface User {
  id: string
  name: string
  email: string
  initials: string
  avatar?: string
  role: 'admin' | 'manager' | 'member' | 'viewer'
  isOnline: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'inprogress' | 'done'
  priority: 'high' | 'medium' | 'low'
  category: 'work' | 'personal' | 'urgent' | 'learning' | 'health'
  deadline: string
  assignees: User[]
  projectId?: string
  isAISuggested: boolean
  commentCount: number
  attachmentCount: number
  createdAt: string
  completedAt?: string
}

export interface Project {
  id: string
  name: string
  description: string
  progress: number
  status: 'active' | 'completed' | 'onhold'
  members: User[]
  taskCount: number
  completedTaskCount: number
  deadline: string
  color: string
}

export interface Notification {
  id: string
  message: string
  type: 'task' | 'team' | 'ai' | 'alert'
  time: string
  isRead: boolean
}

export interface ActivityItem {
  id: string
  user: User
  action: string
  timeAgo: string
  type: 'completed' | 'created' | 'assigned' | 'commented'
}

export interface WeeklyData {
  day: string
  completed: number
  created: number
}

export interface AIInsight {
  id: string
  message: string
}

export interface Comment {
  id: string
  taskId: string
  userId: string
  user: User
  text: string
  createdAt: string
}

export interface TaskWithDetails extends Task {
  comments: Comment[]
  completedAt?: string
}

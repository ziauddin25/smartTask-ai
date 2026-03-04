export type Priority = 'high' | 'medium' | 'low'

export interface TaskAnalysis {
  priority: Priority
  estimatedTime: string
  suggestion: string
  productivityScore: number
}

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: Priority
  estimatedTime?: string
}

const HIGH_PRIORITY_KEYWORDS = ['urgent', 'tomorrow', 'deadline', 'asap', 'important', 'critical', 'emergency', 'now']

const SUGGESTIONS = [
  "Break this task into smaller subtasks for better focus.",
  "Consider doing this first thing in the morning when you're most productive.",
  "This task would benefit from a quick 5-minute planning session first.",
  "Try the Pomodoro technique: 25 minutes of focused work, then a 5-minute break.",
  "Block distractions and find a quiet space for this task.",
  "Consider delegating part of this task if possible.",
  "This is a great task to pair with music or a podcast.",
  "Make sure to take breaks to maintain high energy levels."
]

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateEstimatedTime(priority: Priority): string {
  const timeRanges: Record<Priority, string[]> = {
    high: ['15 min', '30 min', '45 min', '1 hour'],
    medium: ['30 min', '1 hour', '1.5 hours', '2 hours'],
    low: ['1 hour', '2 hours', '3 hours', '4 hours']
  }
  
  return getRandomItem(timeRanges[priority])
}

function generateSuggestion(priority: Priority): string {
  const prioritySuggestions: Record<Priority, string[]> = {
    high: [
      "This is time-sensitive! Focus on completing this as soon as possible.",
      "High priority task - tackle this immediately for maximum impact.",
      "Don't wait - this urgent task should be at the top of your list."
    ],
    medium: [
      "Schedule this for a time when you have good focus and energy.",
      "This task can be batched with similar tasks for efficiency.",
      "Consider the best time of day to tackle this task."
    ],
    low: [
      "This can be done during your low-energy periods.",
      "Save this for when you need a break between bigger tasks.",
      "Good task to handle when you have some extra time."
    ]
  }
  
  return getRandomItem([...prioritySuggestions[priority], ...SUGGESTIONS])
}

export function analyzeTask(taskTitle: string, currentScore: number = 70): TaskAnalysis {
  const titleLower = taskTitle.toLowerCase()
  
  const priority: Priority = HIGH_PRIORITY_KEYWORDS.some(keyword => 
    titleLower.includes(keyword)
  ) ? 'high' : Math.random() > 0.5 ? 'medium' : 'low'
  
  const estimatedTime = generateEstimatedTime(priority)
  const suggestion = generateSuggestion(priority)
  
  const scoreChange = priority === 'high' ? 5 : priority === 'medium' ? 3 : 1
  const productivityScore = Math.min(100, currentScore + scoreChange)
  
  return {
    priority,
    estimatedTime,
    suggestion,
    productivityScore
  }
}

export function updateProductivityScore(
  completedTasks: number, 
  totalTasks: number,
  baseScore: number = 70
): number {
  if (totalTasks === 0) return baseScore
  
  const completionRate = completedTasks / totalTasks
  const bonus = completionRate * 30
  
  return Math.min(100, Math.round(baseScore + bonus))
}

export function generateWeeklySummary(
  tasks: Task[]
): {
  completed: number
  pending: number
  highPriority: number
  totalProductiveHours: number
  message: string
} {
  const completed = tasks.filter(t => t.completed).length
  const pending = tasks.filter(t => !t.completed).length
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length
  
  const productiveHours = completed * 0.75
  
  let message = ""
  if (completed === 0) {
    message = "Start your week strong! Complete at least one task to build momentum."
  } else if (completed < 3) {
    message = "Good start! Keep pushing to complete more tasks."
  } else if (completed < 7) {
    message = "Great progress! You're on track for a productive week."
  } else {
    message = "Excellent work! You're crushing your goals this week!"
  }
  
  if (highPriority > 3) {
    message += " Don't forget to address your high-priority tasks!"
  }
  
  return {
    completed,
    pending,
    highPriority,
    totalProductiveHours: Math.round(productiveHours * 10) / 10,
    message
  }
}

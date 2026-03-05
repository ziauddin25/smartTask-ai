"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useTasks } from "@/hooks/useTasks"
import { ActivityItem, User } from "@/types"
import { users } from "@/data/mockData"

const activityActions = [
  { action: 'completed "{task}"', type: 'completed' as const },
  { action: 'created "{task}"', type: 'created' as const },
  { action: 'assigned "{task}" to {user}', type: 'assigned' as const },
  { action: 'commented on "{task}"', type: 'commented' as const },
  { action: 'moved "{task}" to In Progress', type: 'assigned' as const },
]

const sampleTasks = [
  "API Documentation",
  "Design Review",
  "Bug Fix",
  "Team Meeting",
  "Project Planning",
  "Code Review",
]

function getActivityColor(type: string) {
  switch (type) {
    case 'completed': return 'border-l-green-500'
    case 'created': return 'border-l-blue-500'
    case 'assigned': return 'border-l-purple-500'
    case 'commented': return 'border-l-yellow-500'
    default: return 'border-l-gray-500'
  }
}

function generateRandomActivity(): ActivityItem {
  const randomUser = users[Math.floor(Math.random() * users.length)]
  const randomAction = activityActions[Math.floor(Math.random() * activityActions.length)]
  const randomTask = sampleTasks[Math.floor(Math.random() * sampleTasks.length)]
  
  let actionText = randomAction.action.replace('{task}', randomTask)
  if (actionText.includes('{user}')) {
    const otherUsers = users.filter(u => u.id !== randomUser.id)
    actionText = actionText.replace('{user}', otherUsers[Math.floor(Math.random() * otherUsers.length)].name)
  }
  
  return {
    id: `activity-${Date.now()}`,
    user: randomUser,
    action: actionText,
    timeAgo: 'Just now',
    type: randomAction.type,
  }
}

export function RecentActivity() {
  const { activityLog, addActivity } = useTasks()
  const [displayedActivities, setDisplayedActivities] = useState<ActivityItem[]>([])
  
  useEffect(() => {
    setDisplayedActivities(activityLog.slice(0, 10))
  }, [activityLog])
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateRandomActivity()
      addActivity(newActivity)
      setDisplayedActivities(prev => [newActivity, ...prev.slice(0, 9)])
    }, 30000)
    
    return () => clearInterval(interval)
  }, [addActivity])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <div className="space-y-4">
          {displayedActivities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex items-start gap-3 pl-3 border-l-2 ${getActivityColor(activity.type)} ${
                index === 0 ? 'animate-in slide-in-from-top-2' : ''
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{' '}
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">{activity.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

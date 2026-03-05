"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTasks } from "@/hooks/useTasks"
import { Bell, CheckCircle, Users, Sparkles, AlertTriangle, Check } from "lucide-react"
import Link from "next/link"
import { Task } from "@/types"

function getNotificationIcon(type: string) {
  switch (type) {
    case 'task': return <CheckCircle className="h-4 w-4 text-blue-500" />
    case 'team': return <Users className="h-4 w-4 text-purple-500" />
    case 'ai': return <Sparkles className="h-4 w-4 text-yellow-500" />
    case 'alert': return <AlertTriangle className="h-4 w-4 text-red-500" />
    default: return <Bell className="h-4 w-4" />
  }
}

export function NotificationBell() {
  const { notifications, markNotificationRead, markAllNotificationsRead, tasks } = useTasks()
  const [open, setOpen] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.isRead).length
  
  const handleNotificationClick = (id: string) => {
    markNotificationRead(id)
  }
  
  const handleMarkAllRead = () => {
    markAllNotificationsRead()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {unreadCount} unread
            </span>
          )}
        </div>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {notifications.slice(0, 6).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                !notification.isRead ? "bg-accent border-l-2 border-purple-500" : ""
              }`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="flex items-start gap-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
                {!notification.isRead && (
                  <div className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={handleMarkAllRead}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
        
        <Link
          href="/notifications"
          className="block text-center text-sm text-primary mt-2 hover:underline"
          onClick={() => setOpen(false)}
        >
          View all notifications
        </Link>
      </PopoverContent>
    </Popover>
  )
}

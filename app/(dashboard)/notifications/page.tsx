"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckSquare, 
  Users, 
  Sparkles, 
  AlertCircle,
  Check,
  Trash2,
  Bell,
} from "lucide-react"
import { notifications as mockNotifications } from "@/data/mockData"

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifications)
  const [filter, setFilter] = React.useState("all")

  const unreadCount = notifications.filter(n => !n.isRead).length

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true
    return notification.type === filter
  })

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "task": return <CheckSquare className="h-5 w-5" />
      case "team": return <Users className="h-5 w-5" />
      case "ai": return <Sparkles className="h-5 w-5" />
      case "alert": return <AlertCircle className="h-5 w-5" />
      default: return <Bell className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "task": return "bg-blue-500/10 text-blue-500"
      case "team": return "bg-purple-500/10 text-purple-500"
      case "ai": return "bg-yellow-500/10 text-yellow-500"
      case "alert": return "bg-red-500/10 text-red-500"
      default: return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="gap-2">
            <Check className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="task">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="alert">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 hover:bg-accent/50 transition-colors ${
                      !notification.isRead ? "bg-purple-500/5 border-l-4 border-l-purple-500" : ""
                    }`}
                  >
                    {/* Type Icon */}
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? "font-medium" : ""}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredNotifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

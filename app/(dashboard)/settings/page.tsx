"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Bell, 
  Palette,
  Globe,
  Moon,
  Sun,
  Monitor,
} from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = React.useState("dark")
  const [accentColor, setAccentColor] = React.useState("#7C3AED")
  const [sidebarStyle, setSidebarStyle] = React.useState("default")
  
  const [notifications, setNotifications] = React.useState({
    email: true,
    taskAssigned: true,
    taskOverdue: true,
    teamActivity: true,
    aiSuggestions: true,
    weeklySummary: false,
  })

  const accentColors = [
    { value: "#7C3AED", label: "Purple" },
    { value: "#3B82F6", label: "Blue" },
    { value: "#10B981", label: "Green" },
    { value: "#F59E0B", label: "Orange" },
    { value: "#EF4444", label: "Red" },
    { value: "#EC4899", label: "Pink" },
  ]

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Settings</CardTitle>
              <CardDescription>Manage your workspace preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input id="workspace-name" defaultValue="SmartTask AI" />
              </div>
              <div className="grid gap-2">
                <Label>Language</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Timezone</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>America/Los_Angeles</option>
                  <option>Europe/London</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Assigned to Me</Label>
                  <p className="text-sm text-muted-foreground">Get notified when a task is assigned</p>
                </div>
                <Switch 
                  checked={notifications.taskAssigned}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, taskAssigned: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Overdue Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when tasks are overdue</p>
                </div>
                <Switch 
                  checked={notifications.taskOverdue}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, taskOverdue: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Team Activity</Label>
                  <p className="text-sm text-muted-foreground">Get notified about team member actions</p>
                </div>
                <Switch 
                  checked={notifications.teamActivity}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, teamActivity: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI Suggestions</Label>
                  <p className="text-sm text-muted-foreground">Receive AI-powered task suggestions</p>
                </div>
                <Switch 
                  checked={notifications.aiSuggestions}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, aiSuggestions: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Summary Email</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly productivity summary</p>
                </div>
                <Switch 
                  checked={notifications.weeklySummary}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklySummary: checked })}
                />
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selector */}
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <div className="flex gap-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        theme === option.value 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <option.icon className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={`h-10 w-10 rounded-full transition-transform ${
                        accentColor === color.value ? "scale-110 ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar Style */}
              <div className="space-y-2">
                <Label>Sidebar Style</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={sidebarStyle}
                  onChange={(e) => setSidebarStyle(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="compact">Compact</option>
                  <option value="icon-only">Icon Only</option>
                </select>
              </div>

              <Button>Save Appearance</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

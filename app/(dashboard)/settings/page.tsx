"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useTheme } from "@/hooks/useTheme"
import { 
  Settings, 
  Bell, 
  Palette,
  Globe,
  Moon,
  Sun,
  Monitor,
  Check,
  Save,
} from "lucide-react"
interface UserSettings {
  language: string
  timezone: string
  theme: string
  accentColor: string
  sidebarStyle: string
  workspaceName: string
  notifications: {
    email: boolean
    taskAssigned: boolean
    taskOverdue: boolean
    teamActivity: boolean
    aiSuggestions: boolean
    weeklySummary: boolean
  }
}

const defaultSettings: UserSettings = {
  language: "en",
  timezone: "UTC",
  theme: "light",
  accentColor: "#7C3AED",
  sidebarStyle: "default",
  workspaceName: "SmartTask AI",
  notifications: {
    email: true,
    taskAssigned: true,
    taskOverdue: true,
    teamActivity: true,
    aiSuggestions: true,
    weeklySummary: false,
  },
}

export default function SettingsPage() {
  const { themeSettings, setTheme, setAccentColor, setLanguage, saveSettings, saveAndApply, isLoaded } = useTheme()
  const [settings, setSettings] = React.useState<UserSettings>(defaultSettings)
  const [isSaving, setIsSaving] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("general")

  React.useEffect(() => {
    if (isLoaded) {
      const savedSettings = localStorage.getItem("userSettings")
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          setSettings(prev => ({ ...prev, ...parsed }))
        } catch (e) {
          console.error("Failed to parse settings", e)
        }
      }
    }
  }, [isLoaded])

  React.useEffect(() => {
    if (isLoaded) {
      setSettings(prev => ({
        ...prev,
        theme: themeSettings.theme,
        accentColor: themeSettings.accentColor,
        language: themeSettings.language,
      }))
    }
  }, [themeSettings, isLoaded])

  const handleSave = () => {
    setIsSaving(true)
    setTheme(settings.theme as "light" | "dark" | "system")
    setAccentColor(settings.accentColor)
    setLanguage(settings.language)
    saveAndApply()
    
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Settings saved successfully!")
    }, 500)
  }

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    
    if (newSettings.theme) {
      setTheme(newSettings.theme as "light" | "dark" | "system")
    }
    if (newSettings.accentColor) {
      setAccentColor(newSettings.accentColor)
    }
    if (newSettings.language) {
      setLanguage(newSettings.language)
    }
  }

  const updateNotifications = (key: keyof UserSettings["notifications"], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const languages = [
    { value: "en", label: "English (US)" },
    { value: "en-uk", label: "English (UK)" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ja", label: "Japanese" },
    { value: "bn", label: "Bengali" },
  ]

  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time (US)" },
    { value: "America/Los_Angeles", label: "Pacific Time (US)" },
    { value: "Europe/London", label: "London" },
    { value: "Europe/Paris", label: "Paris" },
    { value: "Asia/Tokyo", label: "Tokyo" },
    { value: "Asia/Dhaka", label: "Dhaka" },
  ]

  const accentColors = [
    { value: "#7C3AED", label: "Purple" },
    { value: "#3B82F6", label: "Blue" },
    { value: "#10B981", label: "Green" },
    { value: "#F59E0B", label: "Orange" },
    { value: "#EF4444", label: "Red" },
    { value: "#EC4899", label: "Pink" },
    { value: "#06B6D4", label: "Cyan" },
    { value: "#8B5CF6", label: "Violet" },
  ]

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                <Input 
                  id="workspace-name" 
                  value={settings.workspaceName}
                  onChange={(e) => updateSettings({ workspaceName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Language</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={settings.language}
                    onChange={(e) => updateSettings({ language: e.target.value })}
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Timezone</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={settings.timezone}
                  onChange={(e) => updateSettings({ timezone: e.target.value })}
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
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
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateNotifications("email", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Assigned to Me</Label>
                  <p className="text-sm text-muted-foreground">Get notified when a task is assigned</p>
                </div>
                <Switch 
                  checked={settings.notifications.taskAssigned}
                  onCheckedChange={(checked) => updateNotifications("taskAssigned", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Overdue Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when tasks are overdue</p>
                </div>
                <Switch 
                  checked={settings.notifications.taskOverdue}
                  onCheckedChange={(checked) => updateNotifications("taskOverdue", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Team Activity</Label>
                  <p className="text-sm text-muted-foreground">Get notified about team member actions</p>
                </div>
                <Switch 
                  checked={settings.notifications.teamActivity}
                  onCheckedChange={(checked) => updateNotifications("teamActivity", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI Suggestions</Label>
                  <p className="text-sm text-muted-foreground">Receive AI-powered task suggestions</p>
                </div>
                <Switch 
                  checked={settings.notifications.aiSuggestions}
                  onCheckedChange={(checked) => updateNotifications("aiSuggestions", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Summary Email</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly productivity summary</p>
                </div>
                <Switch 
                  checked={settings.notifications.weeklySummary}
                  onCheckedChange={(checked) => updateNotifications("weeklySummary", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selector */}
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <div className="flex gap-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateSettings({ theme: option.value })}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        settings.theme === option.value 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <option.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateSettings({ accentColor: color.value })}
                      className={`h-12 w-12 rounded-full transition-all relative ${
                        settings.accentColor === color.value ? "scale-110 ring-2 ring-offset-2 ring-primary" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    >
                      {settings.accentColor === color.value && (
                        <Check className="h-5 w-5 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Selected: {accentColors.find(c => c.value === settings.accentColor)?.label}</p>
              </div>

              {/* Sidebar Style */}
              <div className="space-y-2">
                <Label>Sidebar Style</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={settings.sidebarStyle}
                  onChange={(e) => updateSettings({ sidebarStyle: e.target.value })}
                >
                  <option value="default">Default</option>
                  <option value="compact">Compact</option>
                  <option value="icon-only">Icon Only</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

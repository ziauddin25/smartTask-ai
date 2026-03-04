"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Briefcase,
  Calendar,
  Trash2,
} from "lucide-react"
import { currentUser, tasks } from "@/data/mockData"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false)
  const [profile, setProfile] = React.useState({
    name: currentUser.name,
    email: currentUser.email,
    jobTitle: "Product Manager",
    bio: "Passionate about building great products and leading teams to success.",
  })

  const memberSince = "January 2025"
  const activityLog = [
    { action: "Completed task", target: "Weekly Team Meeting Prep", time: "2 hours ago" },
    { action: "Created task", target: "Client Presentation", time: "5 hours ago" },
    { action: "Updated profile", target: "Profile information", time: "1 day ago" },
    { action: "Completed task", target: "Gym Session", time: "1 day ago" },
    { action: "Created task", target: "Sprint Planning", time: "2 days ago" },
    { action: "Completed task", target: "Code Review PR #45", time: "3 days ago" },
    { action: "Joined team", target: "SmartTask AI", time: "3 days ago" },
    { action: "Created account", target: "New account", time: "Member since January 2025" },
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header - Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600" />
        <CardContent className="relative pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-2xl">{currentUser.initials}</AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                variant="secondary"
              >
                <User className="h-4 w-4" />
              </Button>
            </div>

            {/* Name & Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Badge className="bg-purple-500">{currentUser.role}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {memberSince}
                </span>
              </div>
            </div>

            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="jobTitle" 
                      value={profile.jobTitle}
                      onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
              {isEditing && (
                <Button>Save Changes</Button>
              )}
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity Log */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Tasks</span>
                <span className="font-bold">{tasks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-bold text-green-500">
                  {tasks.filter(t => t.status === "done").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-bold text-blue-500">
                  {tasks.filter(t => t.status === "inprogress").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">To Do</span>
                <span className="font-bold">
                  {tasks.filter(t => t.status === "todo").length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {activityLog.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.target}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

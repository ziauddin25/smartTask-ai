"use client"

import * as React from "react"
import {
  LayoutDashboardIcon,
  CheckSquareIcon,
  FolderKanbanIcon,
  UsersIcon,
  BarChart3Icon,
  BellIcon,
  SettingsIcon,
  UserCircleIcon,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"

const data = {
  navMain: [
    {
      id: 1,
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      id: 2,
      title: "Tasks",
      url: "/tasks",
      icon: CheckSquareIcon,
    },
    {
      id: 3,
      title: "Projects",
      url: "/projects",
      icon: FolderKanbanIcon,
    },
  ],

  navSecondary: [
    {
      id: 4,
      title: "Team",
      url: "/team",
      icon: UsersIcon,
    },
    {
      id: 5,
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3Icon,
    },
  ],

  navAccount: [
    {
      id: 6,
      title: "Notifications",
      url: "/notifications",
      icon: BellIcon,
    },
    {
      id: 7,
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      id: 8,
      title: "Profile",
      url: "/profile",
      icon: UserCircleIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const userData = user
    ? {
        name: user.fullName || '',
        email: user.emailAddresses[0]?.emailAddress || "",
        avatar: user.imageUrl,
      }
    : {
        name: 'User',
        email: 'user@example.com',
        avatar: '',
      };

  return (
    <Sidebar collapsible="none" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" className="flex gap-1.5 items-center">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-white font-bold text-sm">ST</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  SmartTask AI
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
        <NavSecondary items={data.navAccount} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}

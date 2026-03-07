"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  BellIcon,
  FolderIcon,
  LayoutDashboardIcon,
  ListIcon,
  SettingsIcon,
  UserCircleIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: ListIcon,
    },
    // {
    //   title: "Projects",
    //   url: "/projects",
    //   icon: FolderIcon,
    // },
    {
      title: "Team",
      url: "/team",
      icon: UsersIcon,
    },
    // {
    //   title: "Analytics",
    //   url: "/analytics",
    //   icon: BarChartIcon,
    // },
  ],
  navSecondary: [
     {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
    // {
    //   title: "Profile",
    //   url: "/profile",
    //   icon: UserCircleIcon,
    // },
    // {
    //   title: "Notifications",
    //   url: "/notifications",
    //   icon: BellIcon,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user} = useUser()
  const userData = user
    ? {
        name: user.fullName || '',
        email: user.emailAddresses[0]?.emailAddress || "",
        avatar: user.imageUrl,
      }
    : {
        name: '',
        email: '',
        avatar: '',
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
              <a href="/" className="flex items-center gap-2.5 no-underline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/smarttask-logo.svg" alt="SmartTask AI" className="w-9 h-9" />
              <span className="text-lg font-extrabold tracking-tight text-foreground">SmartTask AI</span>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
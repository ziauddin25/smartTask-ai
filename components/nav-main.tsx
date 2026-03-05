"use client"

import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  // const router = useRouter()
  // const isActive = (url: string) => {
  //   const currentPath = router.pathname || "/"
  //   return currentPath === url || (url !== "/dashboard" && currentPath.startsWith(url))
  // }

  const router = useRouter()
const pathname = usePathname()

const isActive = (url: string) => {
  return pathname === url || pathname.startsWith(url + "/")
}

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => router.push(item.url)}
                className={`${
                  isActive(item.url)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/5"
                }`}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
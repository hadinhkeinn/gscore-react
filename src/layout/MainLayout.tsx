import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
    BarChart3,
    FileText,
    Home,
    Search,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface MainLayoutProps {
    children: React.ReactNode
}

// Menu items for the sidebar
const menuItems = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: Home,
    },
    {
        title: "Search Scores",
        path: "/search-scores",
        icon: Search,
    },
    {
        title: "Reports",
        path: "/reports",
        icon: FileText,
    },
    {
        title: "Analytics",
        path: "/analytics",
        icon: BarChart3,
    },
]

export default function MainLayout({ children }: MainLayoutProps) {
    const location = useLocation()
    const navigate = useNavigate()

    const isActive = (path: string) => {
        return location.pathname === path || (path === '/dashboard' && location.pathname === '/')
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <Sidebar variant="inset">
                    <SidebarHeader>
                        <div className="flex items-center gap-3 px-3 py-3">
                            <div className="relative">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 shadow-md">
                                    <span className="text-white font-bold text-sm">G</span>
                                </div>
                                <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-[10px] font-bold">S</span>
                                </div>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    G-Scores Pro
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    Academic Excellence Platform
                                </span>
                            </div>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {menuItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton 
                                                asChild
                                                isActive={isActive(item.path)}
                                            >
                                                <button 
                                                    onClick={() => navigate(item.path)}
                                                    className="w-full"
                                                >
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </button>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>

                <SidebarInset className="flex-1 mt-0">
                    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-4 px-6 w-full">
                            <SidebarTrigger className="-ml-1 hover:bg-accent hover:text-accent-foreground transition-colors" />
                            <Separator orientation="vertical" className="mr-2 h-6" />

                            <div className="flex flex-1 items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 shadow-lg">
                                                <span className="text-white font-bold text-lg">G</span>
                                            </div>
                                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">S</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                G-Scores Pro
                                            </h1>
                                            <p className="text-xs text-muted-foreground -mt-1">
                                                Academic Excellence Platform
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full min-w-0">
                        {/* Content Area */}
                        <div className="flex-1 w-full min-w-0">
                            <div className="rounded-xl bg-muted/50 p-6 w-full h-full">
                                {children}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
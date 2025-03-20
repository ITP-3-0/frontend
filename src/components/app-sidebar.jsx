"use client";

import * as React from "react";
import { UsersIcon, Settings2, Bell } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuth } from "@/Firebase/AuthContext";
import Image from "next/image";

export function AppSidebar({ ...props }) {
    const { user, loading } = useAuth();

    const getUsernameFromEmail = (email) => {
        return email.split("@")[0];
    };

    let userName = getUsernameFromEmail(user.email);

    const data = {
        user: {
            name: userName,
            email: user.email,
        },
        navMain: [
            {
                id: "user-management",
                title: "User Management",
                url: "#",
                icon: UsersIcon,
            },
            {
                id: "notifications",
                title: "Notifications",
                url: "#",
                icon: Bell,
            },
            {
                id: "settings",
                title: "Settings",
                url: "#",
                icon: Settings2,
            },
            // Add more items later on
        ],
    };

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <a href="/dashboard" className="flex flex-col items-center gap-2">
                            <Image src="/eguru.svg" alt="E-Guru Logo" width={80} height={80} />
                            <span className="text-2xl font-semibold mb-5">Admin Dashboard</span>
                        </a>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="mx-2">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}

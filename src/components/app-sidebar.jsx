"use client";

import * as React from "react";
import { UsersIcon, Settings2, Bell } from "lucide-react";
import Link from "next/link";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuth } from "@/Firebase/AuthContext";
import Image from "next/image";

export function AppSidebar({ ...props }) {
    const { user } = useAuth();

    const getUsernameFromEmail = (email) => {
        return email.split("@")[0];
    };

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link href="/dashboard" className="flex flex-col items-center mb-5">
                            <Image src="/eguru.svg" alt="E-Guru Logo" width={80} height={80} />
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="mx-2">
                <SidebarMenu>
                    <SidebarMenuItem className="hover:bg-gray-200 p-2 my-2 rounded-md">
                        <Link href="/dashboard/user-management" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                            <UsersIcon />
                            <span className="font-semibold">User Management</span>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="hover:bg-gray-200 p-2 my-2 rounded-md">
                        <Link href="/dashboard/announcements" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                            <Bell />

                            <span className="font-semibold">Notification Center</span>

                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{ name: getUsernameFromEmail(user.email), email: user.email }} />
            </SidebarFooter>
        </Sidebar>
    );
}

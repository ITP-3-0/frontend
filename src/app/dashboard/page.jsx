"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/Firebase/AuthContext";
import { redirect } from "next/navigation";
import { useTab } from "../Contexts/TabContext";
import UserManagement from "./_Tabs/UserManagement";
import Notifications from "./_Tabs/Notifications";
import Settings from "./_Tabs/Settings";

export default function Page() {
    const { user, loading } = useAuth();
    const { activeTab, setActiveTab } = useTab();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user && !loading) {
        redirect("/login");
    }

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                {activeTab === "user-management" ? (
                    <UserManagement />
                ) : activeTab === "notifications" ? (
                    <Notifications />
                ) : activeTab === "settings" ? (
                    <Settings />
                ) : null}
            </SidebarInset>
        </SidebarProvider>
    );
}

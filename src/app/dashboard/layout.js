"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/Firebase/AuthContext";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardLayout({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!user && !loading) {
        redirect("/login");
    }
    return (
        <div className="dashboard-container">
            <SidebarProvider>
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <main>{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}

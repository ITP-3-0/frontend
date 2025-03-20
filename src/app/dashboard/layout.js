"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/Firebase/AuthContext";
import { redirect, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
    const { user, loading, setLoading } = useAuth();
    const [canRender, setCanRender] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const response = await fetch("/api/users/" + user.uid);
                    const users = await response.json();
                    // CRITICAL : BELOW COMPARISON HAS TO BE CHANGED. ONLY FOR DEVELOPMENT PURPOSES
                    if (users.role !== "client") {
                        router.push("/restricted");
                    } else {
                        setCanRender(true);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        setLoading(true);
        fetchUserData();
    }, [user, setLoading, router]);

    if (!user && !loading) {
        redirect("/login");
    }

    if (canRender) {
        return (
            <div className="dashboard-container">
                <SidebarProvider>
                    <AppSidebar variant="inset" />
                    <SidebarInset>
                        <SiteHeader />
                        <main className="p-10">{children}</main>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        );
    } else {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }
}

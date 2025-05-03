"use client";
import AgentDashboard from "@/components/agent/AgentDashboard";
import NavBar from "../_Components/NavBar";
import { useAuth } from "@/Firebase/AuthContext";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/LoadingComponent/LoadingComponent";

export default function AgentPage() {
    const { user, loading: authLoading } = useAuth();
    const [pageLoading, setPageLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const response = await fetch("/api/users/" + user.uid);
                    const userData = await response.json();
                    if (userData.role === "client") {
                        window.location.href = "/restricted";
                    } else {
                        // User is authorized (agent or admin)
                        setAuthorized(true);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setPageLoading(false);
                }
            } else if (!authLoading) {
                // If authentication is complete and there's no user, redirect to login
                setPageLoading(false);
            }
        };

        // Only run the fetch if auth is done loading
        if (!authLoading) {
            fetchUserData();
        }
    }, [user, authLoading]);

    // Redirect logic - only redirect when we're sure there's no user AND auth loading is complete
    useEffect(() => {
        if (!user && !authLoading && !pageLoading) {
            window.location.href = "/login";
        }
    }, [user, authLoading, pageLoading]);

    if (pageLoading || authLoading) {
        return <LoadingComponent />;
    }

    if (!authorized) {
        return null; // Return null while redirecting
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">
                <AgentDashboard />
            </main>
        </div>
    );
}

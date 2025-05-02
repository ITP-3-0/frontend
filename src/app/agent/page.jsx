"use client";
import AgentDashboard from "@/components/agent/AgentDashboard";
import NavBar from "../_Components/NavBar";
import { useAuth } from "@/Firebase/AuthContext";
import { useEffect } from "react";
import LoadingComponent from "@/components/LoadingComponent/LoadingComponent";

export default function AgentPage() {
    const { user, loading, setLoading } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            if (user) {
                try {
                    const response = await fetch("/api/users/" + user.uid);
                    const users = await response.json();
                    if (users.role === "client") {
                        window.location.href = "/restricted";
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        setLoading(true);
        fetchUserData();
    }, [user, setLoading]);

    if (!user && !loading) {
        window.location.href = "/login";
        return null;
    }

    return (
        // show loading component while loading
        loading ? (
            <LoadingComponent />
        ) : (
            <div className="flex flex-col min-h-screen">
                <NavBar />
                <main className="flex-grow">
                    <AgentDashboard />
                </main>
            </div>
        )
    );
}

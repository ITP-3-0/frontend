"use client";
import NavBar from "../_Components/NavBar";
import { useAuth } from "@/Firebase/AuthContext";

export default function TicketsLayout({ children }) {
    const { user, loading } = useAuth();
    if (!user && !loading) {
        window.location.href = "/login";
        return null;
    }
    return (
        <>
            <NavBar />
            <main className="mt-20">{children}</main>
        </>
    );
}

"use client";

import EditTicketPage from "@/components/ticket-raising/EditTicketForm";
import { useAuth } from "@/Firebase/AuthContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import React from "react";

export default function EditTicketPageWrapper({ params }) {
    // Unwrap the params using React.use()
    const unwrappedParams = React.use(params);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!user && !loading) {
            redirect("/login");
        }
    }, [user, loading]);

    // Show loading state while auth is being checked
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <EditTicketPage params={unwrappedParams} />
        </div>
    );
}

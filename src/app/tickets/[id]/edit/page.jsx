"use client";

import EditTicketPage from "@/components/ticket-raising/EditTicketForm";
import { useAuth } from "@/Firebase/AuthContext";
import { redirect } from "next/navigation";

export default async function EditTicketPageWrapper({ params }) {
    const resolvedParams = await params;
    const { user, loading, setLoading } = useAuth();

    if (!user && !loading) {
        redirect("/login");
    }

    return (
        <div>
            <EditTicketPage params={resolvedParams} />
        </div>
    );
}

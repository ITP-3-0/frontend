"use client";

import AddTicketForm from "@/components/ticket-raising/AddTicketForm";
import { useAuth } from "@/Firebase/AuthContext";
import { redirect } from "next/navigation";

export default function CreateTicketPage() {
    const { user, loading, setLoading } = useAuth();

    if (!user && !loading) {
        redirect("/login");
    }
    return (
        <div>
            <AddTicketForm />
        </div>
    );
}

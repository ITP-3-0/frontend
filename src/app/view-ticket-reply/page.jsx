"use client";

import TicketReply from "@/components/view-ticket-reply/TicketReply";
import { useAuth } from "@/Firebase/AuthContext";
import { redirect } from "next/navigation";

export default function Page() {
    const { user, loading, setLoading } = useAuth();

    if (!user && !loading) {
        redirect("/login");
    }
    return <TicketReply />;
}

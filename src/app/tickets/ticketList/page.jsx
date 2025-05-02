"use client";

import { useEffect, useState } from "react";
import LoadingComponent from "@/components/LoadingComponent/LoadingComponent";
import TicketList from "@/components/ticket-raising/TicketList";
import { useAuth } from "@/Firebase/AuthContext";
import { redirect } from "next/navigation";

export default function TicketListPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    // const { user, loading, setLoading } = useAuth();

    // if (!user && !loading) {
    //     redirect("/login");
    // }

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch("/api/tickets");
                if (!response.ok) {
                    throw new Error("Failed to fetch tickets");
                }
                const data = await response.json();
                setTickets(data.tickets || []);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <div>
            <TicketList tickets={tickets} />
        </div>
    );
}

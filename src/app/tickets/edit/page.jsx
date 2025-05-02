import EditTicketPage from "@/components/ticket-raising/EditTicketForm";
import { useAuth } from "@/Firebase/AuthContext";
import { redirect } from "next/navigation";

async function fetchTicketData(id) {
    const response = await fetch(`/api/tickets/${id}`, { cache: "no-store" });
    if (!response.ok) {
        throw new Error("Failed to fetch ticket data");
    }
    const data = await response.json();
    return data.ticket;
}

export default async function EditTicket({ params }) {
    const ticketData = await fetchTicketData(params.id);
    const { user, loading, setLoading } = useAuth();

    if (!user && !loading) {
        redirect("/login");
    }

    return <EditTicketPage ticketData={ticketData} />;
}

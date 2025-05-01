import EditTicketPage from "@/components/ticket-raising/EditTicketForm";

async function fetchTicketData(id) {
    const response = await fetch(`http://localhost:5000/tickets/${id}`, { cache: "no-store" });
    if (!response.ok) {
        throw new Error("Failed to fetch ticket data");
    }
    const data = await response.json();
    return data.ticket;
}

export default async function EditTicket({ params }) {
    const ticketData = await fetchTicketData(params.id);

    return <EditTicketPage ticketData={ticketData} />;
}
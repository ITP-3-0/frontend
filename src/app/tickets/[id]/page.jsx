"use client";

import TicketDetails from "@/components/ticket-raising/TicketDetails";

export default function TicketDetailsPage({ params }) {
    const { id: ticketId } = params;

    return (
        <div>
            <TicketDetails ticketId={ticketId} />
        </div>
    );
}

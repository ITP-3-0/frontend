"use client";

import EditTicketPage from "@/components/ticket-raising/EditTicketForm";

export default async function EditTicketPageWrapper({ params }) {
    const resolvedParams = await params;

    return (
        <div>
            <EditTicketPage params={resolvedParams} />
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/tickets")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch tickets");
                return res.json();
            })
            .then((data) => {
                setTickets(data.tickets || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleReply = (ticket) => {
        const isWithinWarranty = new Date(ticket.warranty_expiry_date) > new Date();
        const agentLevel = isWithinWarranty ? "Level 1 Agent" : "Level 2 Agent";
        console.log(`Redirecting as ${agentLevel}`);
        router.push(`/ticket-replying/form/${ticket.ticket_id}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Tickets</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Ticket ID</TableCell>
                        <TableCell>Device Name</TableCell>
                        <TableCell>Warranty Expiry</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.ticket_id}>
                            <TableCell>{ticket.ticket_id}</TableCell>
                            <TableCell>{ticket.device_name}</TableCell>
                            <TableCell>{ticket.warranty_expiry_date}</TableCell>
                            <TableCell>{ticket.status}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleReply(ticket)}>Reply</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
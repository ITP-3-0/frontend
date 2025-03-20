// app/tickets/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuTicketCheck } from "react-icons/lu";

export default function TicketsPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch('/api/tickets');

                if (!response.ok) {
                    throw new Error('Failed to fetch tickets');
                }

                const data = await response.json();
                setTickets(data.tickets || []);
            } catch (error) {
                console.error('Error fetching tickets:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this ticket?')) return;

        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete ticket');
            }

            setTickets(tickets.filter(ticket => ticket._id !== id));
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            low: "bg-green-100 text-green-800",
            medium: "bg-yellow-100 text-yellow-800",
            high: "bg-red-100 text-red-800",
        };

        return (
            <Badge className={colors[priority]}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
        );
    };

    const getStatusBadge = (status) => {
        const colors = {
            open: "bg-blue-100 text-blue-800",
            in_progress: "bg-purple-100 text-purple-800",
            closed: "bg-gray-100 text-gray-800",
        };

        const label = status === 'in_progress' ? 'In Progress' :
            status.charAt(0).toUpperCase() + status.slice(1);

        return (
            <Badge className={colors[status]}>
                {label}
            </Badge>
        );
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tickets</h1>
                <Link href="/tickets/create">
                    <Button className="flex items-center gap-2">
                        <LuTicketCheck />
                        Create Ticket
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading tickets...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">No tickets found. Create your first ticket!</p>
                    <Link href="/tickets/create">
                        <Button>Create Ticket</Button>
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Ticket ID</th>
                                <th className="border p-2 text-left">Title</th>
                                <th className="border p-2 text-left">Device</th>
                                <th className="border p-2 text-left">Priority</th>
                                <th className="border p-2 text-left">Status</th>
                                <th className="border p-2 text-left">Created</th>
                                <th className="border p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-gray-50">
                                    <td className="border p-2">{ticket.ticket_id}</td>
                                    <td className="border p-2">{ticket.title}</td>
                                    <td className="border p-2">{ticket.deviceName || 'N/A'}</td>
                                    <td className="border p-2">{getPriorityBadge(ticket.priority)}</td>
                                    <td className="border p-2">{getStatusBadge(ticket.status)}</td>
                                    <td className="border p-2">{new Date(ticket.created_at).toLocaleDateString()}</td>
                                    <td className="border p-2">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(`/tickets/${ticket._id}/edit`)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(ticket._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

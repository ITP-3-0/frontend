'use client';

import { useEffect, useState } from 'react';
import TicketList from '@/components/ticket-raising/TicketList';
import ReplyForm from '@/components/replies/ReplyForm';

export default function ReceivedTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch('http://localhost:5000/tickets');
                if (!response.ok) {
                    throw new Error('Failed to fetch tickets');
                }
                const data = await response.json();
                setTickets(data.tickets || []);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const handleReplyClick = (ticket) => {
        setSelectedTicket(ticket);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Received Tickets</h1>
            {selectedTicket ? (
                <div>
                    <h2 className="text-xl font-bold mb-2">Reply to Ticket: {selectedTicket.title}</h2>
                    <ReplyForm ticketId={selectedTicket._id} onReplyAdded={() => setSelectedTicket(null)} />
                    <button
                        onClick={() => setSelectedTicket(null)}
                        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Back to Tickets
                    </button>
                </div>
            ) : (
                <TicketList
                    tickets={tickets}
                    onReplyClick={handleReplyClick}
                />
            )}
        </div>
    );
}

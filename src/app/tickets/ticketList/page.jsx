'use client';

import { useEffect, useState } from 'react';
import TicketList from '@/components/ticket-raising/TicketList';

export default function TicketListPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    return <TicketList tickets={tickets} />;
}

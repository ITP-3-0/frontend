'use client';

import { useEffect, useState } from 'react';
import { TicketList } from '@/components/ticket-replying/TicketList';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TicketReplyingPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets');
        const data = await response.json();
        setTickets(data.tickets || []); // Ensure `tickets` is an array
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Ticket Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <TicketList tickets={tickets} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
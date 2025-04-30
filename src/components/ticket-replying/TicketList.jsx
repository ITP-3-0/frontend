// frontend/src/components/ticket-replying/TicketList.jsx
'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TicketList({ tickets }) {
  const router = useRouter();

  const handleReply = (ticketId, distributionDate, warrantyPeriod) => {
    console.log('Navigating to ticket:', ticketId);
    const currentDate = new Date();
    const distribution = new Date(distributionDate);
    const warrantyEndDate = new Date(distribution.getTime() + warrantyPeriod * 24 * 60 * 60 * 1000);

    const agentLevel = currentDate > warrantyEndDate ? 'level-2' : 'level-1';
    router.push(`/ticket-replying/form/${ticketId}?agent=${agentLevel}`);
  };

  const calculateWarrantyStatus = (distributionDate, warrantyPeriod) => {
    const currentDate = new Date();
    const distribution = new Date(distributionDate);
    const warrantyEndDate = new Date(distribution.getTime() + warrantyPeriod * 24 * 60 * 60 * 1000); // Add warrantyPeriod in days

    return currentDate > warrantyEndDate ? "Without Warranty" : "Within Warranty";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Distribution Date</TableHead>
            <TableHead>Warranty Period</TableHead>
            <TableHead>Warranty Expiry</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(Array.isArray(tickets) ? tickets : []).map((ticket) => (
            <TableRow key={ticket.ticket_id}>
              <TableCell>{ticket.ticket_id}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>{ticket.description}</TableCell>
              <TableCell>{ticket.deviceName}</TableCell>
              <TableCell>{new Date(ticket.distributionDate).toLocaleDateString()}</TableCell>
              <TableCell>{ticket.warrantyPeriod} Months</TableCell>
              <TableCell>{calculateWarrantyStatus(ticket.distributionDate, ticket.warrantyPeriod)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => handleReply(ticket._id, ticket.distributionDate, ticket.warrantyPeriod)}
                >
                  Reply
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
// frontend/src/app/ticket-replying/submitted/[ticket_id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function SubmittedDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // You should implement proper admin check

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await fetch(`/api/tickets/${params.ticket_id}/reply`);
        const data = await response.json();
        setTicketDetails(data);
        setEditedReply(data.reply_text);
        setStatus(data.status);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [params.ticket_id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`/api/tickets/${params.ticket_id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.ticket_id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply_text: editedReply }),
      });

      if (response.ok) {
        setTicketDetails(prev => ({ ...prev, reply_text: editedReply }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating reply:', error);
    }
  };

  const handleDelete = async () => {
    if (status !== 'Closed') {
      alert('Can only delete replies for closed tickets');
      return;
    }

    try {
      const response = await fetch(`/api/tickets/${params.ticket_id}/reply`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/ticket-replying');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Ticket Reply Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ticket Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Ticket ID:</p>
              <p>{ticketDetails?.ticket_id}</p>
            </div>
            <div>
              <p className="font-semibold">Status:</p>
              {isAdmin ? (
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p>{status}</p>
              )}
            </div>
          </div>

          {/* Reply Content */}
          <div className="space-y-4">
            <p className="font-semibold">Reply:</p>
            {isEditing ? (
              <>
                <Textarea
                  value={editedReply}
                  onChange={(e) => setEditedReply(e.target.value)}
                  className="min-h-[200px]"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleSaveEdit}>Save</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="whitespace-pre-wrap">{ticketDetails?.reply_text}</p>
                {isAdmin && (
                  <Button onClick={() => setIsEditing(true)}>Edit Reply</Button>
                )}
              </>
            )}
          </div>

          {/* Attachment */}
          {ticketDetails?.attachment_url && (
            <div>
              <p className="font-semibold">Attachment:</p>
              <a
                href={ticketDetails.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View PDF
              </a>
            </div>
          )}

          {/* Admin Actions */}
          {isAdmin && status === 'Closed' && (
            <div className="pt-4">
              <Button variant="destructive" onClick={handleDelete}>
                Delete Reply
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TicketReplyFormPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const agentLevel = searchParams.get('agent'); // Get agent level from query params

  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);

  // Log ticket_id for debugging
  console.log('Ticket ID from params:', params.ticket_id);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${params.ticket_id}`);
        const contentType = response.headers.get('content-type');

        if (!response.ok) {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch ticket: ${response.status}`);
          } else {
            throw new Error(`Unexpected response: ${response.status} ${response.statusText}`);
          }
        }

        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response');
        }

        const data = await response.json();
        setTicket(data.ticket);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        setSubmitError(error.message || 'Failed to load ticket data. Please check the ticket ID.');
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.ticket_id) {
      fetchTicket();
    }
  }, [params.ticket_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('reply', reply);
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch(`/api/tickets/${params.ticket_id}/reply`, {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Ticket not found. Please verify the ticket ID.');
        }
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit reply');
        }
        throw new Error(`Unexpected response: ${response.status} ${response.statusText}`);
      }

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const responseData = await response.json();
      alert(responseData.message || 'Reply submitted successfully!');
      setReply('');
      setFile(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
      setSubmitError(error.message || 'An error occurred while submitting the reply.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!ticket) {
    return <p>{submitError || 'Ticket not found. Please check the ticket ID.'}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reply to Ticket #{params.ticket_id}</h1>
      <div className="mb-4">
        <p><strong>Title:</strong> {ticket.title}</p>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Priority:</strong> {ticket.priority}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
        <p><strong>Agent Level:</strong> {agentLevel === 'level-1' ? 'Level 1 Agent' : 'Level 2 Agent'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Write your reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          required
        />
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Button type="submit">Submit Reply</Button>
        {submitError && <p className="text-red-500">{submitError}</p>}
      </form>
    </div>
  );
}
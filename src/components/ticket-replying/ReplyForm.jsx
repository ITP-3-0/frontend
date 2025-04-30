// frontend/src/components/ticket-replying/ReplyForm.jsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ReplyForm({ ticket }) {
  const [reply, setReply] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!ticket || !ticket.ticket_id) {
        throw new Error('Ticket ID is missing. Cannot submit reply.');
      }

      const formData = new FormData();
      formData.append('reply', reply);

      const response = await fetch(`/api/tickets/${ticket.ticket_id}/reply`, {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Unexpected response format');
      }

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit reply');
      }

      alert('Reply submitted successfully!');
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert(error.message || 'An error occurred while submitting the reply.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Write your reply..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        required
      />
      <Button type="submit">Submit Reply</Button>
    </form>
  );
}
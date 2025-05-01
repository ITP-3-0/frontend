import React from 'react';
import { format } from 'date-fns';

const ReplyList = ({ replies }) => {
    if (!replies || replies.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No replies yet
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {replies.map((reply, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold">{reply.agentName}</span>
                        <span className="text-sm text-gray-500">
                            {format(new Date(reply.created_at), 'MMM d, yyyy h:mm a')}
                        </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                </div>
            ))}
        </div>
    );
};

export default ReplyList; 
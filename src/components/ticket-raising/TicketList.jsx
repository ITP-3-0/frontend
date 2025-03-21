'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PencilIcon, TrashIcon, LaptopIcon, PlusIcon, CheckCircle2 } from 'lucide-react';

export default function TicketList({ tickets }) {
    const router = useRouter();
    const [ticketList, setTicketList] = useState(tickets);  // Store tickets locally
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleEdit = (id) => {
        router.push(`/tickets/${id}/edit`);
    };

    const handleDelete = async () => {
        if (!ticketToDelete) return;

        setIsLoading(true); // Start loading
        try {
            const response = await fetch(`http://localhost:5000/tickets/${ticketToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete ticket');
            }

            // Remove the deleted ticket from state (instead of refreshing page)
            setTicketList(ticketList.filter(ticket => ticket._id !== ticketToDelete));

            setShowToast(true); // Show success message

            // Hide success message after 2 seconds
            setTimeout(() => {
                setShowToast(false);
            }, 2000);
        } catch (error) {
            console.error('Error deleting ticket:', error);
        } finally {
            setIsLoading(false);
            setIsDeleteDialogOpen(false);
            setTicketToDelete(null);
        }
    };

    const openDeleteDialog = (id) => {
        setTicketToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-red-100 text-red-800',
        };

        return (
            <Badge className={colors[priority]}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
        );
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-full max-w-4xl p-4 bg-white rounded-md shadow-lg">
                {/* Add Ticket Button */}
                <div className="flex justify-end mb-4">
                    <Button onClick={() => router.push('/tickets/create')} className="bg-blue-600 hover:bg-blue-700">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Ticket
                    </Button>
                </div>

                {/* Ticket List */}
                <div className="rounded-md border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Device</TableHead>
                                <TableHead>Distribution Date</TableHead>
                                <TableHead>Agent Name</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ticketList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <LaptopIcon className="h-10 w-10 mb-2 text-gray-400" />
                                            <p>No Data</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                ticketList.map((ticket) => (
                                    <TableRow key={ticket._id} className="border-b">
                                        <TableCell>{ticket.title}</TableCell>
                                        <TableCell>{ticket.description}</TableCell>
                                        <TableCell>{ticket.deviceName || 'N/A'}</TableCell>
                                        <TableCell>{new Date(ticket.distributionDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{ticket.agentName || 'N/A'}</TableCell>
                                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                        <TableCell className="text-right flex gap-2 justify-end">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(ticket._id)}>
                                                <PencilIcon className="h-5 w-5 text-blue-600" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={isLoading}
                                                onClick={() => openDeleteDialog(ticket._id)}
                                            >
                                                <TrashIcon className="h-5 w-5 text-red-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the ticket.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Success Toast Notification (Bottom-Right) */}
                {showToast && (
                    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <span>Customer Code deleted successfully</span>
                        <button onClick={() => setShowToast(false)} className="ml-auto text-white font-bold">
                            ✕
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

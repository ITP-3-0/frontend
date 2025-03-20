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
import { PencilIcon, TrashIcon, LaptopIcon } from 'lucide-react';

export default function TicketList({ tickets }) {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    const handleEdit = (id) => {
        router.push(`/tickets/${id}/edit`);
    };

    const handleDelete = async () => {
        if (!ticketToDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/tickets/${ticketToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete ticket');
            }

            // Refresh the page after deleting the ticket
            router.refresh();
        } catch (error) {
            console.error('Error deleting ticket:', error);
        } finally {
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
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Device</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <LaptopIcon className="h-10 w-10 mb-2 text-gray-400" />
                                        <p>No Data</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket) => (
                                <TableRow key={ticket._id} className="border-b">
                                    <TableCell>{ticket.title}</TableCell>
                                    <TableCell>{ticket.description}</TableCell>
                                    <TableCell>{ticket.deviceName || 'N/A'}</TableCell>
                                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                    <TableCell className="text-right flex gap-2 justify-end">
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(ticket._id)}>
                                            <PencilIcon className="h-5 w-5 text-blue-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
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

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the ticket.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

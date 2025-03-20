// app/components/ticket-raising/TicketForm.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QrScanner from './QrScanner';

const ticketSchema = z.object({
    title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    deviceName: z.string().optional(),
    distributionDate: z.string().optional(),
    warrantyPeriod: z.string().optional(),
    agentName: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']),
    creator: z.string().min(1, { message: 'Creator is required' }),
});

export default function TicketForm({ ticket, isEditing = false }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            title: ticket?.title || '',
            description: ticket?.description || '',
            deviceName: ticket?.deviceName || '',
            distributionDate: ticket?.distributionDate || '',
            warrantyPeriod: ticket?.warrantyPeriod || '',
            agentName: ticket?.agentName || '',
            priority: ticket?.priority || 'medium',
            creator: ticket?.creator || 'Mindu', // Default value or get from auth context
        },
    });

    const handleQrScan = (deviceData) => {
        form.setValue('deviceName', deviceData.deviceName);
        form.setValue('distributionDate', deviceData.distributionDate);
        form.setValue('warrantyPeriod', deviceData.warrantyPeriod);
        form.setValue('agentName', deviceData.agentName);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const url = isEditing
                ? `/api/tickets/${ticket._id}`
                : '/api/tickets';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to save ticket');
            }

            router.push('/tickets');
            router.refresh();
        } catch (error) {
            console.error('Error saving ticket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{isEditing ? 'Edit Ticket' : 'Create New Ticket'}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex justify-end">
                            <QrScanner onScanSuccess={handleQrScan} />
                        </div>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter ticket title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the issue in detail"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="deviceName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Device Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Device Name"
                                                {...field}
                                                disabled={!!field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="distributionDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Distribution Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Distribution Date"
                                                {...field}
                                                disabled={!!field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="warrantyPeriod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warranty Period</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Warranty Period"
                                                {...field}
                                                disabled={!!field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="agentName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Agent Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Agent Name"
                                                {...field}
                                                disabled={!!field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/tickets')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : isEditing ? 'Update Ticket' : 'Create Ticket'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

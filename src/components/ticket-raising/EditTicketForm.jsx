"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Smartphone, Calendar, Clock, User, AlertCircle, CheckCircle, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function EditTicketPage({ params }) {
    const router = useRouter();
    const { toast } = useToast();
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        deviceName: "",
        distributionDate: "",
        warrantyPeriod: "",
    });

    // Check if form has been modified - only consider title and description as editable
    const hasChanges = originalData && (formData.title !== originalData.title || formData.description !== originalData.description);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await fetch(`/api/tickets/${id}`);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Failed to fetch ticket");
                }

                const data = await response.json();

                // Format date for input field if it exists
                let formattedDate = "";
                if (data.ticket.distributionDate) {
                    const date = new Date(data.ticket.distributionDate);
                    formattedDate = date.toISOString().split("T")[0];
                }

                const ticketData = {
                    title: data.ticket.title,
                    description: data.ticket.description,
                    deviceName: data.ticket.deviceName || "",
                    distributionDate: formattedDate,
                    warrantyPeriod: data.ticket.warrantyPeriod || "",
                };

                setFormData(ticketData);
                setOriginalData(ticketData);
            } catch (error) {
                console.error("Error fetching ticket:", error);
                setError(error.message || "An unexpected error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to update ticket");
            }

            toast({
                title: "Success",
                description: "Ticket updated successfully",
                variant: "success",
            });

            router.push("/tickets/ticketList");
        } catch (error) {
            console.error("Error updating ticket:", error);
            setError(error.message);

            toast({
                title: "Error",
                description: error.message || "Failed to update ticket",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate warranty status
    const getWarrantyStatus = () => {
        try {
            if (!formData.distributionDate || !formData.warrantyPeriod) return null;

            const currentDate = new Date();
            const distributionDate = new Date(formData.distributionDate);

            let warrantyMonths = 0;
            if (typeof formData.warrantyPeriod === "number") {
                warrantyMonths = formData.warrantyPeriod;
            } else if (typeof formData.warrantyPeriod === "string") {
                const match = formData.warrantyPeriod.match(/\d+/);
                if (match) {
                    warrantyMonths = Number.parseInt(match[0], 10);
                }
            }

            const expirationDate = new Date(distributionDate);
            expirationDate.setMonth(expirationDate.getMonth() + warrantyMonths);

            const isActive = currentDate <= expirationDate;

            // Calculate days remaining or days expired
            const diffTime = Math.abs(expirationDate - currentDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
                isActive,
                diffDays,
                expirationDate,
            };
        } catch (error) {
            return null;
        }
    };

    const warrantyStatus = getWarrantyStatus();

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
            <Button
                variant="ghost"
                className="mb-6 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => router.push("/tickets/ticketList")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to tickets
            </Button>

            <div className="flex flex-col gap-8">
                {/* Header with gradient background */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 p-8 text-white shadow-lg">
                    <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=1000')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit Ticket</h1>
                            <p className="mt-1 opacity-90">Update ticket information</p>
                        </div>
                        {!isLoading && !error && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <span className="text-sm font-medium">Ticket ID:</span>
                                <span className="text-sm font-mono bg-white/20 px-2 py-0.5 rounded">{id}</span>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="animate-in fade-in-50 slide-in-from-top-5">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isLoading ? (
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-muted/50 pb-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-28" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t p-6">
                            <div className="flex justify-end gap-2 w-full">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </CardFooter>
                    </Card>
                ) : (
                    !error && (
                        <Card className="border-none shadow-md overflow-hidden">
                            <form onSubmit={handleSubmit}>
                                <CardHeader className="bg-muted/50 pb-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <CardTitle>Ticket Information</CardTitle>
                                            <CardDescription>Make changes to the ticket details below</CardDescription>
                                        </div>
                                        {hasChanges && (
                                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md text-sm">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>Unsaved changes</span>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor="title" className="text-base">
                                                    Title
                                                </Label>
                                                {formData.title !== originalData?.title && (
                                                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Modified</span>
                                                )}
                                            </div>
                                            <Input
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="Enter ticket title"
                                                className="h-11"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor="description" className="text-base">
                                                    Description
                                                </Label>
                                                {formData.description !== originalData?.description && (
                                                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Modified</span>
                                                )}
                                            </div>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Describe the issue in detail"
                                                className="min-h-[180px] resize-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium">Device Information</h3>
                                                <p className="text-sm text-muted-foreground">Device details cannot be modified</p>
                                            </div>

                                            {warrantyStatus && (
                                                <div
                                                    className={`flex items-center gap-2 ${warrantyStatus.isActive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                                                        } px-3 py-1.5 rounded-md text-sm`}
                                                >
                                                    {warrantyStatus.isActive ? (
                                                        <>
                                                            <CheckCircle className="h-4 w-4" />
                                                            <span>Active - {warrantyStatus.diffDays} days remaining</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="h-4 w-4" />
                                                            <span>Expired - {warrantyStatus.diffDays} days ago</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-muted p-2 rounded-full mt-0.5">
                                                        <Smartphone className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="deviceName" className="text-base">
                                                            Device Name
                                                        </Label>
                                                        <Input
                                                            id="deviceName"
                                                            name="deviceName"
                                                            value={formData.deviceName}
                                                            onChange={handleChange}
                                                            placeholder="Device Name"
                                                            className="bg-muted/30"
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-muted p-2 rounded-full mt-0.5">
                                                        <Calendar className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="distributionDate" className="text-base">
                                                            Distribution Date
                                                        </Label>
                                                        <Input
                                                            id="distributionDate"
                                                            name="distributionDate"
                                                            type="date"
                                                            value={formData.distributionDate}
                                                            onChange={handleChange}
                                                            placeholder="Distribution Date"
                                                            className="bg-muted/30"
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-muted p-2 rounded-full mt-0.5">
                                                        <Clock className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="warrantyPeriod" className="text-base">
                                                            Warranty Period
                                                        </Label>
                                                        <Input
                                                            id="warrantyPeriod"
                                                            name="warrantyPeriod"
                                                            value={formData.warrantyPeriod}
                                                            onChange={handleChange}
                                                            placeholder="Warranty Period"
                                                            className="bg-muted/30"
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex justify-between border-t p-6">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => router.push("/tickets/ticketList")}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Discard changes and return to ticket list</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div>
                                                    <Button
                                                        type="submit"
                                                        disabled={isSubmitting || !hasChanges}
                                                        className={`bg-purple-600 hover:bg-purple-700 min-w-[120px] ${!hasChanges ? "opacity-50 cursor-not-allowed" : ""
                                                            }`}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="mr-2 h-4 w-4" />
                                                                Update Ticket
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {hasChanges ? "Save changes to this ticket" : "No changes have been made to save"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </CardFooter>
                            </form>
                        </Card>
                    )
                )}
            </div>
        </div>
    );
}

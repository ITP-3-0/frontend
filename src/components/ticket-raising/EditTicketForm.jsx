"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export default function EditTicketPage({ params }) {
    const router = useRouter()
    const { toast } = useToast()
    const { id } = params
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        deviceName: "",
        distributionDate: "",
        warrantyPeriod: "",
        agentName: "",
        priority: "medium",
    })

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await fetch(`http://localhost:5000/tickets/${id}`)

                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(errorText || "Failed to fetch ticket")
                }

                const data = await response.json()

                // Format date for input field if it exists
                let formattedDate = ""
                if (data.ticket.distributionDate) {
                    const date = new Date(data.ticket.distributionDate)
                    formattedDate = date.toISOString().split("T")[0]
                }

                setFormData({
                    title: data.ticket.title,
                    description: data.ticket.description,
                    deviceName: data.ticket.deviceName || "",
                    distributionDate: formattedDate,
                    warrantyPeriod: data.ticket.warrantyPeriod || "",
                    agentName: data.ticket.agentName || "",
                    priority: data.ticket.priority,
                })
            } catch (error) {
                console.error("Error fetching ticket:", error)
                setError(error.message || "An unexpected error occurred")
            } finally {
                setIsLoading(false)
            }
        }

        fetchTicket()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handlePriorityChange = (value) => {
        setFormData((prev) => ({ ...prev, priority: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch(`http://localhost:5000/tickets/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(errorData || "Failed to update ticket")
            }

            toast({
                title: "Success",
                description: "Ticket updated successfully",
                variant: "success",
            })

            router.push("/tickets/ticketList")
        } catch (error) {
            console.error("Error updating ticket:", error)
            setError(error.message)

            toast({
                title: "Error",
                description: error.message || "Failed to update ticket",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-6 px-4 md:px-6 max-w-4xl">
            <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground" onClick={() => router.push("/tickets/ticketList")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to tickets
            </Button>

            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Ticket</h1>
                    <p className="text-muted-foreground mt-1">Update ticket information</p>
                </div>

                {isLoading ? (
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                        <CardFooter>
                            <div className="flex justify-end gap-2 w-full">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </CardFooter>
                    </Card>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle>Ticket Information</CardTitle>
                                <CardDescription>Make changes to the ticket details below</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter ticket title"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the issue in detail"
                                        className="min-h-[120px]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="deviceName">Device Name</Label>
                                        <Input
                                            id="deviceName"
                                            name="deviceName"
                                            value={formData.deviceName}
                                            onChange={handleChange}
                                            placeholder="Device Name"
                                            disabled={!!formData.deviceName}
                                        />
                                        {!!formData.deviceName && (
                                            <p className="text-xs text-muted-foreground mt-1">Device name cannot be changed</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="distributionDate">Distribution Date</Label>
                                        <Input
                                            id="distributionDate"
                                            name="distributionDate"
                                            type="date"
                                            value={formData.distributionDate}
                                            onChange={handleChange}
                                            placeholder="Distribution Date"
                                            disabled={!!formData.distributionDate}
                                        />
                                        {!!formData.distributionDate && (
                                            <p className="text-xs text-muted-foreground mt-1">Distribution date cannot be changed</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="warrantyPeriod">Warranty Period</Label>
                                        <Input
                                            id="warrantyPeriod"
                                            name="warrantyPeriod"
                                            value={formData.warrantyPeriod}
                                            onChange={handleChange}
                                            placeholder="Warranty Period"
                                            disabled={!!formData.warrantyPeriod}
                                        />
                                        {!!formData.warrantyPeriod && (
                                            <p className="text-xs text-muted-foreground mt-1">Warranty period cannot be changed</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="agentName">Agent Name</Label>
                                        <Input
                                            id="agentName"
                                            name="agentName"
                                            value={formData.agentName}
                                            onChange={handleChange}
                                            placeholder="Agent Name"
                                            disabled={!!formData.agentName}
                                        />
                                        {!!formData.agentName && (
                                            <p className="text-xs text-muted-foreground mt-1">Agent name cannot be changed</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="priority">Priority</Label>
                                    <RadioGroup value={formData.priority} onValueChange={handlePriorityChange} className="flex space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="low" id="low" />
                                            <Label htmlFor="low" className="cursor-pointer">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Low
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="medium" id="medium" />
                                            <Label htmlFor="medium" className="cursor-pointer">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Medium
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="high" id="high" />
                                            <Label htmlFor="high" className="cursor-pointer">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    High
                                                </span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => router.push("/tickets/ticketList")}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Ticket"
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}
            </div>
        </div>
    )
}


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, QrCode } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import QrScanner from "@/components/ticket-raising/QrScanner"

export default function CreateTicketPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [showQrScanner, setShowQrScanner] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        deviceName: "",
        distributionDate: "",
        warrantyPeriod: 0,
        agentName: "",
        priority: "medium",
        creator: "User",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handlePriorityChange = (value) => {
        setFormData((prev) => ({ ...prev, priority: value }))
    }

    const handleQrScan = (deviceData) => {
        try {
            console.log("Scanned QR Code Data:", deviceData) // Debugging the scanned data

            // Use deviceData directly since it's already an object
            setFormData((prev) => ({
                ...prev,
                deviceName: deviceData.deviceName || "",
                distributionDate: deviceData.distributionDate || "",
                warrantyPeriod: deviceData.warrantyPeriod || "",
                agentName: deviceData.agentName || "",
            }))

            toast({
                title: "QR Code Scanned",
                description: "Device information has been loaded successfully",
                variant: "success",
            })
        } catch (error) {
            console.error("Error processing QR code:", error) // Log the error for debugging
            setErrorMessage("Failed to process QR code. Please try again.")

            toast({
                title: "Error",
                description: "Failed to process QR code data",
                variant: "destructive",
            })
        } finally {
            setShowQrScanner(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMessage(null)

        try {
            const response = await fetch("http://localhost:5000/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                let errorMessage = `Failed to create ticket: ${response.status} ${response.statusText}`
                const contentType = response.headers.get("Content-Type")
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json()
                    if (errorData?.message) {
                        errorMessage = errorData.message
                    }
                }
                throw new Error(errorMessage)
            }

            toast({
                title: "Success",
                description: "Ticket created successfully",
                variant: "success",
            })

            router.push("/tickets/ticketList")
        } catch (error) {
            console.error("Error creating ticket:", error)
            setErrorMessage(error.message || "Failed to create ticket. Please try again.")

            toast({
                title: "Error",
                description: error.message || "Failed to create ticket",
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
                    <h1 className="text-3xl font-bold tracking-tight">Create Ticket</h1>
                    <p className="text-muted-foreground mt-1">Submit a new support ticket</p>
                </div>

                {errorMessage && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle>Ticket Information</CardTitle>
                            <CardDescription>Fill in the details below to create a new ticket</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => setShowQrScanner(true)}
                        >
                            <QrCode className="h-4 w-4" />
                            Scan QR Code
                        </Button>
                    </CardHeader>

                    {/* QR Scanner Modal */}
                    {showQrScanner && (
                        <QrScanner
                            onScanSuccess={handleQrScan}
                            onClose={() => setShowQrScanner(false)}
                        />
                    )}

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6 pt-6">
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

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <Label className="text-sm font-medium">Device Information</Label>
                                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                        Use QR code to auto-fill
                                    </div>
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
                                            <p className="text-xs text-muted-foreground mt-1">Scan a different QR code to change</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="distributionDate">Distribution Date</Label>
                                        <Input
                                            id="distributionDate"
                                            name="distributionDate"
                                            value={formData.distributionDate}
                                            onChange={handleChange}
                                            placeholder="YYYY-MM-DD"
                                            disabled={!!formData.distributionDate}
                                        />
                                        {!!formData.distributionDate && (
                                            <p className="text-xs text-muted-foreground mt-1">Scan a different QR code to change</p>
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
                                            <p className="text-xs text-muted-foreground mt-1">Scan a different QR code to change</p>
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
                                            <p className="text-xs text-muted-foreground mt-1">Scan a different QR code to change</p>
                                        )}
                                    </div>
                                </div>
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
                                        Creating...
                                    </>
                                ) : (
                                    "Create Ticket"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Loader2,
    QrCode,
    FileText,
    Smartphone,
    Calendar,
    Clock,
    User,
    AlertCircle,
    CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import QrScanner from "@/components/ticket-raising/QrScanner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export default function CreateTicketPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [showQrScanner, setShowQrScanner] = useState(false)
    const [activeTab, setActiveTab] = useState("details")
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        deviceName: "",
        distributionDate: "",
        warrantyPeriod: 0,
        agentName: "",
        creator: "User",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
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

            // Switch to device tab after successful scan
            setActiveTab("device")
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

    // Check if device info is complete
    const isDeviceInfoComplete =
        formData.deviceName && formData.distributionDate && formData.warrantyPeriod && formData.agentName

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
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold tracking-tight">Create Ticket</h1>
                        <p className="mt-1 opacity-90">Submit a new support ticket for device issues</p>
                    </div>
                </div>

                {errorMessage && (
                    <Alert variant="destructive" className="animate-in fade-in-50 slide-in-from-top-5">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Card className="border-none shadow-md overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Ticket Information</CardTitle>
                                <CardDescription>Fill in the details below to create a new ticket</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    {/* QR Scanner Modal */}
                    {showQrScanner && <QrScanner onScanSuccess={handleQrScan} onClose={() => setShowQrScanner(false)} />}

                    <form onSubmit={handleSubmit}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="px-6 pt-2">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="details" className="data-[state=active]:bg-background">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Ticket Details
                                    </TabsTrigger>
                                    <TabsTrigger value="device" className="data-[state=active]:bg-background">
                                        <Smartphone className="h-4 w-4 mr-2" />
                                        Device Information
                                        {isDeviceInfoComplete && <CheckCircle className="h-3 w-3 ml-2 text-green-500" />}
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <CardContent className="p-0">
                                <TabsContent value="details" className="m-0 p-6 space-y-6 focus:outline-none">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-base">
                                            Title
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter ticket title"
                                            className="h-11"
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">Provide a clear and concise title for your ticket</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-base">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Describe the issue in detail"
                                            className="min-h-[180px] resize-none"
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Include any relevant details about the issue you're experiencing
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center pt-4">
                                        <p className="text-sm text-muted-foreground">Next: Device Information</p>
                                        <Button
                                            type="button"
                                            onClick={() => setActiveTab("device")}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            Continue
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="device" className="m-0 focus:outline-none">
                                    <div className="p-6 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium">Device Information</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Device details will be auto-filled when you scan a QR code
                                                </p>
                                            </div>

                                            {!isDeviceInfoComplete && (
                                                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md text-sm">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span>Scan QR code required</span>
                                                </div>
                                            )}

                                            {isDeviceInfoComplete && (
                                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-md text-sm">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Device info complete</span>
                                                </div>
                                            )}
                                        </div>

                                        <Separator />

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
                                                            className={formData.deviceName ? "border-green-300" : ""}
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
                                                            value={formData.distributionDate}
                                                            onChange={handleChange}
                                                            placeholder="YYYY-MM-DD"
                                                            className={formData.distributionDate ? "border-green-300" : ""}
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
                                                            className={formData.warrantyPeriod ? "border-green-300" : ""}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-muted p-2 rounded-full mt-0.5">
                                                        <User className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="agentName" className="text-base">
                                                            Agent Name
                                                        </Label>
                                                        <Input
                                                            id="agentName"
                                                            name="agentName"
                                                            value={formData.agentName}
                                                            onChange={handleChange}
                                                            placeholder="Agent Name"
                                                            className={formData.agentName ? "border-green-300" : ""}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {!isDeviceInfoComplete && (
                                            <div className="bg-muted/50 p-4 rounded-lg mt-4">
                                                <div className="flex items-start gap-3">
                                                    <QrCode className="h-5 w-5 text-purple-600 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium">Scan QR Code to Continue</h4>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            You need to scan a valid device QR code to auto-fill the device information. Click the
                                                            "Scan QR Code" button at the top of the form.
                                                        </p>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-3"
                                                            onClick={() => setShowQrScanner(true)}
                                                        >
                                                            <QrCode className="h-4 w-4 mr-2" />
                                                            Scan QR Code
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <CardFooter className="flex justify-between border-t p-6">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="outline" onClick={() => router.push("/tickets/ticketList")}>
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting || !isDeviceInfoComplete}
                                                className="bg-purple-600 hover:bg-purple-700 min-w-[120px]"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Creating...
                                                    </>
                                                ) : (
                                                    "Create Ticket"
                                                )}
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </form>
                </Card>
            </div>
        </div>
    )
}

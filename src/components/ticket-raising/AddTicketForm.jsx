"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, QrCode, FileText, Smartphone, Calendar, Clock, User, AlertCircle, CheckCircle } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

    const [showCustomWarranty, setShowCustomWarranty] = useState(false)
    const [isQrMode, setIsQrMode] = useState(true); // State to toggle between QR and manual mode

    useEffect(() => {
        // Check if warranty period is set to "Custom"
        if (formData.warrantyPeriod === "Custom") {
            setShowCustomWarranty(true)
        } else {
            setShowCustomWarranty(false)
        }
    }, [formData.warrantyPeriod])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMessage(null)

        try {
            const response = await fetch("/api/tickets", {
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
        formData.deviceName && formData.distributionDate && formData.warrantyPeriod

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
                                    <TabsTrigger
                                        value="device"
                                        className="data-[state=active]:bg-background"
                                        disabled={!formData.title || !formData.description} // Disable if title or description is empty
                                    >
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
                                            disabled={!formData.title || !formData.description} // Disable if title or description is empty
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
                                                    Device details will be auto-filled when you scan a QR code.<br /> Additionally You Can Manually Enter the Details.
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

                                        <div className="space-y-6">
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-medium">Device Information</h4>
                                                    <div className="h-px flex-1 bg-muted"></div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor="qrModeToggle" className="text-sm text-muted-foreground">
                                                        Use QR Filling Mode
                                                    </Label>
                                                    <input
                                                        id="qrModeToggle"
                                                        type="checkbox"
                                                        checked={isQrMode}
                                                        onChange={(e) => setIsQrMode(e.target.checked)}
                                                        className="toggle-checkbox"
                                                    />
                                                    <span className="text-xs text-muted-foreground ml-2">
                                                        {isQrMode ? "Values can only be entered via QR scan" : "Manual editing enabled"}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-muted/30 rounded-lg">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="bg-muted p-2 rounded-full">
                                                            <Smartphone className="h-4 w-4 text-purple-600" />
                                                        </div>
                                                        <div className="space-y-1 flex-1">
                                                            <Label htmlFor="deviceName" className="text-xs text-muted-foreground">
                                                                Device Name
                                                                {isQrMode && <span className="ml-1 text-amber-500">(QR only)</span>}
                                                            </Label>
                                                            <Input
                                                                id="deviceName"
                                                                name="deviceName"
                                                                value={formData.deviceName}
                                                                onChange={handleChange}
                                                                placeholder={isQrMode ? "Scan QR to fill" : "Enter device name"}
                                                                className={`h-9 ${formData.deviceName ? "border-green-300" : ""} ${isQrMode ? "bg-muted/50" : ""}`}
                                                                required
                                                                readOnly={isQrMode}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="bg-muted p-2 rounded-full">
                                                            <Calendar className="h-4 w-4 text-purple-600" />
                                                        </div>
                                                        <div className="space-y-1 flex-1">
                                                            <Label htmlFor="distributionDate" className="text-xs text-muted-foreground">
                                                                Distribution Date
                                                                {isQrMode && <span className="ml-1 text-amber-500">(QR only)</span>}
                                                            </Label>
                                                            <Input
                                                                id="distributionDate"
                                                                name="distributionDate"
                                                                type="date"
                                                                value={formData.distributionDate}
                                                                onChange={handleChange}
                                                                max={new Date().toISOString().split("T")[0]}
                                                                placeholder="YYYY-MM-DD"
                                                                className={`h-9 ${formData.distributionDate ? "border-green-300" : ""} ${isQrMode ? "bg-muted/50" : ""}`}
                                                                required
                                                                readOnly={isQrMode}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="bg-muted p-2 rounded-full">
                                                            <Clock className="h-4 w-4 text-purple-600" />
                                                        </div>
                                                        <div className="space-y-1 flex-1">
                                                            <Label htmlFor="warrantyPeriod" className="text-xs text-muted-foreground">
                                                                Warranty Period
                                                                {isQrMode && <span className="ml-1 text-amber-500">(QR only)</span>}
                                                            </Label>
                                                            {isQrMode ? (
                                                                // Text box for QR filling mode
                                                                <Input
                                                                    id="warrantyPeriod"
                                                                    name="warrantyPeriod"
                                                                    value={formData.warrantyPeriod}
                                                                    onChange={handleChange}
                                                                    placeholder="Scan QR to fill"
                                                                    className={`h-9 ${formData.warrantyPeriod ? "border-green-300" : ""} bg-muted/50`}
                                                                    required
                                                                    readOnly={true}
                                                                />
                                                            ) : (
                                                                // Dropdown for manual filling mode
                                                                <Select
                                                                    name="warrantyPeriod"
                                                                    value={formData.warrantyPeriod}
                                                                    onValueChange={(value) => {
                                                                        setFormData((prev) => ({ ...prev, warrantyPeriod: value }));
                                                                    }}
                                                                >
                                                                    <SelectTrigger className={`h-9 ${formData.warrantyPeriod ? "border-green-300" : ""}`}>
                                                                        <SelectValue placeholder="Select period" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="06 Months">06 Months</SelectItem>
                                                                        <SelectItem value="12 Months">12 Months</SelectItem>
                                                                        <SelectItem value="18 Months">18 Months</SelectItem>
                                                                        <SelectItem value="24 Months">24 Months</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {showCustomWarranty && (
                                            <div className="mt-4 ml-10">
                                                <div className="space-y-1">
                                                    <Label htmlFor="customWarrantyPeriod" className="text-xs text-muted-foreground">
                                                        Custom Warranty Period
                                                    </Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            id="customWarrantyPeriod"
                                                            name="customWarrantyPeriod"
                                                            type="number"
                                                            placeholder="Enter months"
                                                            className="h-9 w-32"
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (value) {
                                                                    setFormData(prev => ({ ...prev, warrantyPeriod: `${value} Months` }))
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-sm text-muted-foreground">Months</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!isDeviceInfoComplete && isQrMode && (
                                            <div className="bg-muted/50 p-4 rounded-lg mt-4">
                                                <div className="flex items-start gap-3">
                                                    <QrCode className="h-5 w-5 text-purple-600 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium">Scan QR Code to Continue</h4>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            QR Filling Mode is enabled. You must scan a valid device QR code to auto-fill
                                                            the device information. Manual editing is disabled in this mode.
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

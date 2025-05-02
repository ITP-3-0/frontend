'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

export default function QrScanner({ onScanSuccess, onClose }) {
    const [scanError, setScanError] = useState(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        // Initialize scanner when component mounts
        const qrScanner = new Html5QrcodeScanner('reader', {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
        }, false); // Don't start scanning automatically

        // Start scanning
        qrScanner.render((decodedText) => {
            console.log("Scanned QR Code Data:", decodedText); // Debugging
            try {
                let deviceData;

                try {
                    // First try to parse as JSON
                    deviceData = JSON.parse(decodedText);
                } catch (jsonError) {
                    // If not JSON, try to parse as key-value pairs
                    deviceData = {};
                    const parts = decodedText.split(',');

                    parts.forEach(part => {
                        const [key, value] = part.split(':').map(item => item?.trim());
                        if (key && value) {
                            const propertyMap = {
                                'Device Name': 'deviceName',
                                'Distribution Date': 'distributionDate',
                                'Warranty Period': 'warrantyPeriod',
                            };

                            const mappedKey = propertyMap[key] || key.toLowerCase().replace(/\s+/g, '');
                            deviceData[mappedKey] = value;
                        }
                    });

                    // If no properties were extracted, throw an error
                    if (Object.keys(deviceData).length === 0) {
                        throw new Error('Could not extract device data from QR code');
                    }
                }

                // Pass the data to the parent component
                onScanSuccess(deviceData);

                // Clean up
                setScanError(null);
                qrScanner.clear();
                if (onClose) onClose();
            } catch (err) {
                console.error("Invalid QR code format:", err);
                setScanError("Could not read device data from QR code. Please try again or enter details manually.");

                // Auto-clear error after 3 seconds
                setTimeout(() => setScanError(null), 3000);
            }
        }, (error) => {
            console.warn(error);
        });

        scannerRef.current = qrScanner;

        // Clean up on unmount
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
            }
        };
    }, [onScanSuccess, onClose]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium flex items-center">
                        <Camera className="mr-2 h-5 w-5" />
                        Scan Device QR Code
                    </h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 rounded-full"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>

                {scanError && (
                    <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded mb-3 text-sm">
                        {scanError}
                    </div>
                )}

                <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                    <div id="reader" className="w-full"></div>
                </div>

                <p className="text-xs text-muted-foreground mt-3 text-center">
                    Position the QR code within the scanner frame
                </p>

                <div className="mt-4 flex justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}

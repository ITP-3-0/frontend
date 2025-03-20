'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

export default function QrScanner({ onScanSuccess }) {
    const [isScanning, setIsScanning] = useState(false);
    const [scanner, setScanner] = useState(null);
    const [scanError, setScanError] = useState(null);

    useEffect(() => {
        if (isScanning && !scanner) {
            const qrScanner = new Html5QrcodeScanner('reader', {
                fps: 10,
                qrbox: 250
            });

            qrScanner.render((decodedText) => {
                try {
                    try {
                        const deviceData = JSON.parse(decodedText);
                        onScanSuccess(deviceData);
                    } catch (jsonError) {
                        
                        const deviceData = {};

                        const parts = decodedText.split(',');
                        parts.forEach(part => {
                            const [key, value] = part.split(':').map(item => item.trim());
                            if (key && value) {
                                const propertyMap = {
                                    'Device Name': 'deviceName',
                                    'Distribution Date': 'distributionDate',
                                    'Warranty Period': 'warrantyPeriod',
                                    'Agent Name': 'agentName'
                                };

                                const mappedKey = propertyMap[key] || key.toLowerCase().replace(/\s+/g, '');
                                deviceData[mappedKey] = value;
                            }
                        });

                        // Only proceed if we extracted at least one property
                        if (Object.keys(deviceData).length > 0) {
                            onScanSuccess(deviceData);
                        } else {
                            throw new Error('Could not extract device data from QR code');
                        }
                    }

                    setIsScanning(false);
                    setScanError(null);
                    qrScanner.clear();
                } catch (err) {
                    console.error("Invalid QR code format:", err);
                    setScanError("Could not read device data from QR code. Please try again or enter details manually.");

                    // Auto-clear error after 3 seconds
                    setTimeout(() => setScanError(null), 3000);
                }
            }, (error) => {
                console.warn(error);
            });

            setScanner(qrScanner);
        }

        return () => {
            if (scanner) {
                scanner.clear();
            }
        };
    }, [isScanning, scanner, onScanSuccess]);

    return (
        <div>
            {!isScanning ? (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsScanning(true)}
                >
                    Scan QR Code
                </Button>
            ) : (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-medium mb-2">Scan Device QR Code</h3>
                        {scanError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                                {scanError}
                            </div>
                        )}
                        <div id="reader" className="w-full"></div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsScanning(false);
                                setScanError(null);
                                if (scanner) scanner.clear();
                            }}
                            className="mt-4"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

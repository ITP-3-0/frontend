"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parse } from "papaparse";

export function FileUploader({ onClose, onUpload }) {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        setError("");

        // Check file type
        const fileType = file.name.split(".").pop().toLowerCase();
        if (!["csv", "xlsx", "xls"].includes(fileType)) {
            setError("Please upload a CSV or Excel file");
            return;
        }

        setFile(file);
    };

    const handleUpload = () => {
        if (!file) {
            setError("Please select a file to upload");
            return;
        }
        setError("");
        if (file.name.endsWith(".csv")) {
            parse(file, {
                header: true,
                complete: (results) => {
                    onUpload(results.data); // Pass the parsed data to the parent component
                    onClose(); // Close the dialog after upload
                },
                error: (error) => {
                    setError("Error parsing file: " + error.message);
                },
            });
        } else {
            setError("Unsupported file type for parsing. Please use CSV files.");
            return;
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Import Users</DialogTitle>
                    <DialogDescription>Upload a CSV or Excel file containing user data.</DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv,.xlsx,.xls" className="hidden" />

                    {file ? (
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium">
                                <FileText className="h-6 w-6 text-primary" />
                                <span>{file.name}</span>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setFile(null)}>
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove file</span>
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
                                <p className="text-xs text-muted-foreground">Supports CSV and Excel files up to 5MB</p>
                            </div>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                Select File
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={!file}>
                        Upload and Process
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

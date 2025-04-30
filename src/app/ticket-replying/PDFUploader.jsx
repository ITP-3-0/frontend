// frontend/src/components/ticket-replying/PDFUploader.jsx
'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function PDFUploader({ onFileSelect }) {
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      onFileSelect(null);
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      onFileSelect(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size should be less than 5MB');
      onFileSelect(null);
      return;
    }

    onFileSelect(file);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="pdf-upload">Attachment (PDF only, max 5MB)</Label>
      <Input
        id="pdf-upload"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
      />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
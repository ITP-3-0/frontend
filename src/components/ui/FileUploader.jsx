//import { useState } from 'react';

const FileUploader = ({ onUpload }) => {
    const [files, setFiles] = useState([]);

    const handleFileChange = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setFiles(uploadedFiles);
        onUpload(uploadedFiles);
    };

    return (
        <input type="file" multiple onChange={handleFileChange} className="border p-2" />
    );
};
export default FileUploader;
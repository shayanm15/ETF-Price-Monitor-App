import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { API_URL } from '../../../../constants/api';
import "./FileUpload.css"

const FileUpload = () => {
    const fileInputRef = useRef(null);


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        // FormData handles the file encoding to multipart/form-data
        const formData = new FormData();
        formData.append('file', file);

        // Sending a file server side needs to sent as multipart/form-data due to the encoding format that browsers use for file uploads
        const res = await axios.post(`${API_URL}file/upload`, formData);

        e.target.value = '';
    }

    return (
        <div className="uploadCard">
            <h2>Upload CSV Files</h2>
            <div className="dropzone" onClick={() => fileInputRef.current.click()}>
                <CloudUploadIcon className="icon" />
                <p className="label">
                    Drag & drop CSV files here,<br />or click to browse
                </p>
                <Button variant="contained">Upload</Button>
                <p className="hint">CSV files only</p>
                <input type="file" accept=".csv" hidden ref={fileInputRef} onChange={handleFileUpload} />
            </div>
        </div>
    )
}

export default FileUpload
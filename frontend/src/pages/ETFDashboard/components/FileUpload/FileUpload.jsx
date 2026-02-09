import { useRef } from 'react'
import axios from 'axios';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { API_URL } from '../../../../constants/api';
import "./FileUpload.css"

const FileUpload = ({
    setETFData = () => { },
    setError = () => { },
    setOpenAlert = () => { },
    setLoading = () => { },
    loading
}) => {
    const fileInputRef = useRef(null);


    const uploadCSVFile = async (file) => {

        try {

            if (!file) {
                return;
            }

            setLoading(true);

            // FormData handles the file encoding to multipart/form-data
            const formData = new FormData();
            formData.append('file', file);

            // Sending a file server side needs to sent as multipart/form-data due to the encoding format that browsers use for file uploads
            const res = await axios.post(`${API_URL}file/upload`, formData);

            if (res.status === 200 && res.data.status === "success") {
                setETFData(res.data.data);
                setError(null);
            }

        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setETFData(null);
        } finally {
            setOpenAlert(true);
            setLoading(false);

        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        await uploadCSVFile(file);
        e.target.value = '';
    }

    const handleFileDrop = async (e) => {
        // Prevents the browser default behavior of opening/downloading the file
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        await uploadCSVFile(file);
    }

    return (
        <div className="uploadCard">
            <h2>Upload CSV File</h2>
            <div
                className={`dropzone ${loading ? 'disabled' : ''}`}
                onClick={() => !loading && fileInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => !loading && handleFileDrop(e)}
            >
                <CloudUploadIcon className="icon" />
                <p className="label">
                    Drag & drop CSV file here,<br />or click to browse
                </p>
                <Button variant="contained" sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}>Upload</Button>
                <p className="hint">CSV files only</p>
                <input type="file" accept=".csv" hidden ref={fileInputRef} onChange={handleFileUpload} />
            </div>
        </div>
    )
}

export default FileUpload
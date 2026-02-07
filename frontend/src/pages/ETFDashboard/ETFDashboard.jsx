import React, { useState } from 'react'
import FileUpload from './components/FileUpload/FileUpload';
import ActionAlert from '../../components/ActionAlert/ActionAlert';
import ConstituentTable from './components/ConstituentTable/ConstituentTable';

const ETFDashboard = () => {

    const [etfData, setETFData] = useState(null);
    const [error, setError] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);

    return (
        <>
            <FileUpload
                setETFData={setETFData}
                setError={setError}
                setOpenAlert={setOpenAlert}
            />
            <ActionAlert
                isSuccess={!error}
                message={error ? error : 'File uploaded successfully'}
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
            />
            {etfData ? (
                <ConstituentTable
                    data={etfData.mostRecentConstituentData}
                />
            ) : (
                null
            )}
        </>
    )
}

export default ETFDashboard
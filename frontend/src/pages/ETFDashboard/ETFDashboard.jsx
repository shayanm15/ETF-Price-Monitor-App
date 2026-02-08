import React, { useState } from 'react'
import FileUpload from './components/FileUpload/FileUpload';
import ActionAlert from '../../components/ActionAlert/ActionAlert';
import ConstituentTable from './components/ConstituentTable/ConstituentTable';
import TimeSeriesPlot from './components/TimeSeriesPlot/TimeSeriesPlot';
import TopHoldingsChart from './components/TopHoldingsChart/TopHoldingsChart';

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
            {etfData?.mostRecentConstituentData ? (
                <ConstituentTable
                    data={etfData.mostRecentConstituentData}
                />
            ) : (
                null
            )}
            {etfData?.etfPriceTimeData ? (
                <TimeSeriesPlot
                    data={etfData?.etfPriceTimeData}
                />
            ) : (
                null
            )}
            {etfData?.topHoldings ? (
                <TopHoldingsChart
                    data={etfData?.topHoldings}
                />
            ) : (
                null
            )}
        </>
    )
}

export default ETFDashboard
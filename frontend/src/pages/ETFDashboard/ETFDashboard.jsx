import { useState } from 'react'
import FileUpload from './components/FileUpload/FileUpload';
import ActionAlert from '../../components/ActionAlert/ActionAlert';
import ConstituentTable from './components/ConstituentTable/ConstituentTable';
import TimeSeriesPlot from './components/TimeSeriesPlot/TimeSeriesPlot';
import TopHoldingsChart from './components/TopHoldingsChart/TopHoldingsChart';
import './ETFDashboard.css';
import Spinner from '../../components/Spinner/Spinner';

const ETFDashboard = () => {

    const [etfData, setETFData] = useState(null);
    const [error, setError] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(false);


    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <div className={etfData ? 'dashboard' : 'dashboardEmpty'}>
                    <div>
                        <FileUpload
                            setETFData={setETFData}
                            setError={setError}
                            setOpenAlert={setOpenAlert}
                            setLoading={setLoading}
                            loading={loading}
                        />
                        {openAlert ? (
                            <ActionAlert
                                isSuccess={!error}
                                message={error ? error : 'File uploaded successfully'}
                                openAlert={openAlert}
                                setOpenAlert={setOpenAlert}
                            />
                        ) : (
                            null
                        )}
                        {!error && etfData?.constituentData ? (
                            <ConstituentTable
                                data={etfData.constituentData}
                            />
                        ) : (
                            null
                        )}
                    </div>
                    {etfData && (
                        <div>
                            {!error && etfData?.etfPriceTimeData ? (
                                <TimeSeriesPlot
                                    data={etfData?.etfPriceTimeData}
                                />
                            ) : (
                                null
                            )}
                            {!error && etfData?.topHoldings ? (
                                <TopHoldingsChart
                                    data={etfData?.topHoldings}
                                />
                            ) : (
                                null
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default ETFDashboard
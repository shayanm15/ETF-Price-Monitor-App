import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Brush } from 'recharts';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './TimeSeriesPlot.css';

const TimeSeriesPlot = ({
    data = []
}) => {
    return (
        <div className="chartCard">
            <h2>Historical ETF Price</h2>
            <p className="chartDescription">
                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                A zoomable time series plot of the reconstructed price of the ETF
            </p>
            <ResponsiveContainer
                width="100%"
                height={525}
            >
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                    />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickMargin={8}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                        tick={{ fontSize: 12 }}
                        tickMargin={8}
                        label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', offset: -5, style: { fontSize: 13, fill: '#64748b' } }}
                    />
                    <Tooltip
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Brush
                        dataKey="date"
                        height={30}
                        stroke="#10b981"
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TimeSeriesPlot
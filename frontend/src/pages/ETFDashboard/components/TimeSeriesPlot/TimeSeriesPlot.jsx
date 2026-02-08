import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Brush } from 'recharts';
import './TimeSeriesPlot.css';

const TimeSeriesPlot = ({
    data = []
}) => {
    return (
        <div className="chartCard">
            <h2>Historical ETF Price</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
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
                    <Brush dataKey="date" height={30} stroke="#3b82f6" />
                    <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TimeSeriesPlot
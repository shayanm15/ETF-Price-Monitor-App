import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './TopHoldingsChart.css';

const TopHoldingsChart = ({
    data
}) => {
    return (
        <div className="chartCard">
            <h2>Top 5 Holdings</h2>
            <p className="chartDescription">
                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                Top 5 biggest holdings in the ETF as of the latest market close
            </p>
            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <BarChart
                    layout="vertical" data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                >
                    <XAxis
                        type='number'
                        tick={{ fontSize: 12 }}
                        tickMargin={8}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickMargin={8}
                        label={{ value: 'Constituent', angle: -90, position: 'insideLeft', offset: -5, style: { fontSize: 13, fill: '#64748b' } }}
                    />
                    <Tooltip
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Holding Size']}
                        labelFormatter={(label) => `Constituent: ${label}`}
                    />
                    <Bar
                        dataKey="holdingSize"
                        fill="#10b981"
                        radius={[0, 6, 6, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TopHoldingsChart
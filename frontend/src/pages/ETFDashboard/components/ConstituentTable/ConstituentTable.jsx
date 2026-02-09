import { DataGrid } from '@mui/x-data-grid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './ConstituentTable.css';

const ConstituentTable = ({
    data = []
}) => {

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'weight', headerName: 'Weight', flex: 1 },
        { field: 'recentClosePrice', headerName: 'Latest Close', flex: 1, valueFormatter: (value) => `$${value.toFixed(2)}` },
    ];

    return (
        <div className="constituentCard">
            <h2>Constituent Data</h2>
            <p className="chartDescription">
                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                An interactive table of the constituent data
            </p>
            <DataGrid
                rows={data}
                columns={columns}
                getRowId={(row) => row.name}
                disableColumnMenu={false}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f8fafc',
                        fontWeight: 700,
                    },
                }}
            />
        </div>
    )
}

export default ConstituentTable

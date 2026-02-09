import { Box, CircularProgress } from '@mui/material';

function Spinner({ size = 60, color = '#10b981' }) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                width: '100%',
                py: 4
            }}
        >
            <CircularProgress
                size={size}
                sx={{
                    color
                }}
            />
        </Box>
    );
}

export default Spinner;

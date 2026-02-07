import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const ActionAlert = ({
    isSuccess,
    message,
    openAlert,
    setOpenAlert = () => {}
}) => {
    return (
        <Snackbar
            open={openAlert}
            autoHideDuration={3000}
            onClose={() => setOpenAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                severity={isSuccess ? 'success' : 'error'}
                sx={{ fontSize: '1rem', minWidth: '300px' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default ActionAlert
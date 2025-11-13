import { Alert } from '@mui/material';
import React from 'react'

const Popup = ({ message, severity, onClose, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <Alert severity={severity}>{message}</Alert>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    )
}

export default Popup
import React, { useState, useEffect } from 'react';
import './cookies.css';

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const isConsentGiven = localStorage.getItem('cookieConsent');
        if (!isConsentGiven) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-popup">
            <div className="cookie-popup-content">
                <h2>Política de Cookies</h2>
                <p>Usamos cookies para mejorar su experiencia. Al continuar navegando, acepta nuestro uso de cookies.</p>
                <button onClick={handleAccept}>Aceptar</button>
            </div>
        </div>
    );
};

export default CookieConsent;

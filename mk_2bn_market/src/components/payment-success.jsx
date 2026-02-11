import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Récupère le dernier produit payé
        const lastProductId = localStorage.getItem('lastProductId');
        const status = searchParams.get('completed');
        console.log('Statut du paiement:', status);
        
        if (lastProductId && searchParams.get('completed') === 'true') {
            console.log('✅ Redirection vers le produit:', lastProductId);
            // Attend 2 secondes pour laisser le callback se traiter
            setTimeout(() => {
                navigate(`/product/${lastProductId}?payment=success`);
            }, 2000);
        }
    }, [navigate, searchParams]);

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '50vh',
            gap: 2
        }}>
            <h2>✅ Paiement effectué !</h2>
            <p>Redirection en cours...</p>
            <CircularProgress />
        </Box>
    );
}
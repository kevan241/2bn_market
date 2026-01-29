import { Box, TextField, Button } from "@mui/material";
import { useState } from 'react';
import { API_URL } from '../../config/api';

export default function EbillingPaiement({ product }) { // ← Reçoit le produit en props
    const [payer_msisdn, setPayer_msisdn] = useState('');
    const [payer_email, setPayer_email] = useState('');
    const [loading, setLoading] = useState(false);

const handleCheckout = async () => {
    setLoading(true);
    
    try {
        const cleanPrice = parseInt(product.price.toString().replace(/[^0-9]/g, ''));
        
        // ✅ Stocke l'email ET le productId
        localStorage.setItem('userEmail', payer_email);
        localStorage.setItem('lastProductId', product._id); // ← AJOUTE
        
        const response = await fetch(`${API_URL}/api/payment/create-ebill`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                payer_msisdn: payer_msisdn,
                payer_email: payer_email,
                amount: cleanPrice,
                productId: product._id,
                productName: product.name
            })
        });

        const data = await response.json();
        
        if (data.success && data.payment_url) {
            console.log('✅ Redirection vers Ebilling...');
            window.location.href = data.payment_url;
        } else {
            throw new Error(data.error || 'Erreur lors de la création du paiement');
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        alert('❌ Erreur : ' + error.message);
    } finally {
        setLoading(false);
    }
};

    return (
        <Box sx={{ marginTop: 3, padding: 3, backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '20px' }}>Informations de paiement</h3>
            
            <TextField 
                fullWidth
                label="Numéro de téléphone"
                type="number"
                value={payer_msisdn}
                onChange={(e) => setPayer_msisdn(e.target.value)}
                margin="normal"
                placeholder="241062000000"
                required
            />
            
            <TextField 
                fullWidth
                label="Email"
                type="email"
                value={payer_email}
                onChange={(e) => setPayer_email(e.target.value)}
                margin="normal"
                placeholder="email@example.com"
                required
            />
            
            <Button 
                variant="contained"
                fullWidth
                onClick={handleCheckout}
                disabled={loading || !payer_msisdn || !payer_email}
                sx={{ marginTop: 2, padding: '12px' }}
            >
                {loading ? "Traitement en cours..." : `💳 Payer ${product.price} XAF`}
            </Button>

            <Box sx={{ marginTop: 2, fontSize: '0.9rem', color: '#666' }}>
                <p>✓ Paiement sécurisé via Ebilling</p>
                <p>✓ Accès immédiat après validation</p>
            </Box>
        </Box>
    );
}
import { Box, Button, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProductById } from './services/productServices';
import { API_URL } from '../config/api';
import PaymentForm from './checkout/ebilling_paiement';
import '../custome.css';

export default function Product_profil() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [productProfil, setProductProfil] = useState(null);
    const [profilLoading, setProfilLoading] = useState(true);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [hasPaid, setHasPaid] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        getProductById(id).then(data => {
            setProductProfil(data);
            setProfilLoading(false);
        });
        
        // ✅ Vérifie si on revient d'un paiement
        if (searchParams.get('payment') === 'success') {
            setShowSuccessMessage(true);
            // Cache le message après 10 secondes
            setTimeout(() => setShowSuccessMessage(false), 10000);
        }
    }, [id, searchParams]);

    // ✅ Vérifie si l'utilisateur a payé
    useEffect(() => {
        const checkPayment = async () => {
            const email = localStorage.getItem('userEmail');
            if (email && id) {
                setUserEmail(email);
                try {
                    const response = await fetch(`${API_URL}/api/payment/check-payment/${id}/${email}`);
                    const data = await response.json();
                    setHasPaid(data.hasPaid);
                    
                    // Si paiement confirmé et message de succès, force le rechargement
                    if (data.hasPaid && showSuccessMessage) {
                        console.log('✅ Paiement confirmé !');
                    }
                } catch (error) {
                    console.error('Erreur vérification paiement:', error);
                }
            }
        };
        
        if (!profilLoading) {
            checkPayment();
            
            // ✅ Revérifie toutes les 3 secondes si on vient de payer
            if (showSuccessMessage) {
                const interval = setInterval(checkPayment, 3000);
                return () => clearInterval(interval);
            }
        }
    }, [id, profilLoading, showSuccessMessage]);

    if (profilLoading) return <div>Chargement de la fiche de produit...</div>;
    if (!productProfil) return <div>Produit non trouvé</div>;

    const getImagePath = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('../')) return imagePath;
        if (imagePath.startsWith('./')) return imagePath.replace(/^\.\//, '../');
        if (imagePath.startsWith('img/')) return `../${imagePath}`;
        return imagePath;
    };

    const handleDownload = () => {
        if (productProfil.fileUrl) {
            const link = document.createElement('a');
            link.href = `${API_URL}/${productProfil.fileUrl}`;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('Aucun fichier disponible pour ce produit');
        }
    };

    return (
        <Box className="product_profil_container" sx={{ display: 'flex', padding: '30px 80px' }}>
            <Box className="profil_product_container_img" sx={{ color: 'black' }}>
                <div className="profil_product_container">
                    <div className='product_banner'>
                        <img src={getImagePath(productProfil.image)} alt={productProfil.name} width='100%' />
                    </div>
                </div>
            </Box>
            <Box sx={{ flex: 1 }}>
                <div className="profil_product_container_details">
                    {/* ✅ Message de succès après paiement */}
                    {showSuccessMessage && (
                        <Alert severity="success" sx={{ marginBottom: 3 }}>
                            🎉 Paiement réussi ! {hasPaid ? 'Vous pouvez maintenant télécharger le fichier.' : 'Vérification en cours...'}
                        </Alert>
                    )}
                    
                    <div className='product_title'><h2>{productProfil.name}</h2></div>
                    <div className='product_description'>{productProfil.description}</div>
                    <div className='product_price'>{productProfil.price} XAF</div>
                    
                    {/* ✅ Affiche le bouton de paiement seulement si pas encore payé */}
                    {!hasPaid && (
                        !showPaymentForm ? (
                            <Button className="basket_button" variant="contained" fullWidth
                                onClick={() => setShowPaymentForm(true)} sx={{ marginTop: 3, padding: '12px' }}>
                                Effectuer le paiement
                            </Button>
                        ) : (
                            <Box>
                                <PaymentForm product={productProfil} />
                                <Button fullWidth onClick={() => setShowPaymentForm(false)} sx={{ marginTop: 2 }}>
                                    ← Annuler
                                </Button>
                            </Box>
                        )
                    )}
                    
                    {/* ✅ Affiche le bouton de téléchargement seulement si payé */}
                    {hasPaid && productProfil.fileUrl && (
                        <Button 
                            className="basket_button_validate" 
                            variant="contained" 
                            color="success"
                            onClick={handleDownload}
                            sx={{ marginTop: 3 }}
                        >
                            📥 Télécharger le fichier
                        </Button>
                    )}
                    
                    {hasPaid && !productProfil.fileUrl && (
                        <Box sx={{ marginTop: 3, color: 'orange' }}>
                            ⚠️ Paiement confirmé mais aucun fichier disponible
                        </Box>
                    )}
                    
                    {/* Message de chargement pendant la vérification */}
                    {showSuccessMessage && !hasPaid && (
                        <Box sx={{ marginTop: 3, color: 'blue' }}>
                            ⏳ Vérification du paiement en cours...
                        </Box>
                    )}
                </div>
            </Box>
        </Box>
    );
}
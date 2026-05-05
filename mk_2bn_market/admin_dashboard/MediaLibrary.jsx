import { Box, Button, CircularProgress, Typography, Snackbar, Alert } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import SideMenu from './services/side_menu';
import { API_URL } from '../src/config/api';

export default function MediaLibrary() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const fileInputRef = useRef();

    const fetchImages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/cloudinary/images`);
            const data = await res.json();
            setImages(data.images || []);
        } catch (err) {
            showSnackbar('Erreur lors du chargement des images', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'Images');

            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                showSnackbar('Image uploadée avec succès !', 'success');
                fetchImages();
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            showSnackbar(err.message || 'Erreur upload', 'error');
        } finally {
            setUploading(false);
            fileInputRef.current.value = '';
        }
    };

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        showSnackbar('URL copiée ! Tu peux la coller dans "Créer un produit"', 'success');
        setTimeout(() => setCopiedUrl(''), 2000);
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <SideMenu />
            <Box sx={{ flex: 1, padding: '30px' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <Typography variant="h5" fontWeight="bold">
                        🖼️ Bibliothèque médias
                    </Typography>
                    <Box>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleUpload}
                        />
                        <Button
                            variant="contained"
                            onClick={() => fileInputRef.current.click()}
                            disabled={uploading}
                            sx={{ backgroundColor: '#1976d2' }}
                        >
                            {uploading ? <><CircularProgress size={16} sx={{ mr: 1, color: 'white' }} /> Upload en cours...</> : '+ Ajouter une image'}
                        </Button>
                    </Box>
                </Box>

                {/* Info */}
                <Typography sx={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
                    Clique sur une image pour copier son URL et l'utiliser dans "Créer un produit".
                </Typography>

                {/* Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
                        <CircularProgress />
                    </Box>
                ) : images.length === 0 ? (
                    <Typography sx={{ color: '#999', textAlign: 'center', marginTop: '80px' }}>
                        Aucune image trouvée. Commence par en uploader une !
                    </Typography>
                ) : (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '16px',
                    }}>
                        {images.map((img) => (
                            <Box
                                key={img.public_id}
                                onClick={() => handleCopy(img.secure_url)}
                                sx={{
                                    position: 'relative',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: copiedUrl === img.secure_url ? '3px solid #1976d2' : '3px solid transparent',
                                    transition: 'all 0.2s',
                                    '&:hover .overlay': { opacity: 1 },
                                    '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
                                }}
                            >
                                <img
                                    src={img.secure_url}
                                    alt={img.public_id}
                                    style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                                />
                                {/* Overlay */}
                                <Box className="overlay" sx={{
                                    position: 'absolute', inset: 0,
                                    backgroundColor: 'rgba(25, 118, 210, 0.75)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0, transition: 'opacity 0.2s',
                                }}>
                                    <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                        {copiedUrl === img.secure_url ? '✅ Copié !' : '📋 Copier l\'URL'}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
import { Box, Button, TextField, MenuItem, LinearProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { createProduct } from './services/productService';
import SideMenu from './services/side_menu';
import { API_URL } from '../src/config/api';
import './dashboard.css';

export default function CreateProduct() {
    
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [uploadPicture, setUploadPicture] = useState(false);
    const [name, setName] = useState('');
    const [notice, setNotice] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categoriesOptions = [
        { label: 'Xls', value: 'documents', id: 'xls' },
        { label: 'Documents', value: 'documents', id: 'doc' },
        { label: 'Vidéos', value: 'Media', id: 'media' },
        { label: 'Word', value: 'documents', id: 'word' },
        { label: 'Formations', value: 'formations', id: 'form' },
        { label: 'Outils', value: 'outils', id: 'outils' },
    ];

    const convertDriveUrl = (url) => {
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match) {
            return `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }
        return url;
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadPicture(true);
        setError('');
        setImagePreview(URL.createObjectURL(file));

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', 'Images');

            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                setImage(data.fileUrl);
                setImagePreview(data.fileUrl);
            } else {
                throw new Error(data.error || 'Erreur upload image');
            }

        } catch (err) {
            console.error('Erreur image:', err);
            setError(err.message);
            setImagePreview('');
        } finally {
            setUploadPicture(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const productData = {
                image,
                name,
                notice,
                description,
                price,
                categories,
                fileUrl,
                content
            };

            await createProduct(productData);

            setImage('');
            setImagePreview('');
            setName('');
            setNotice('');
            setDescription('');
            setPrice('');
            setCategories('');
            setFileUrl('');
            setContent('');
            
            alert('Produit créé avec succès ! ✅');

        } catch (err) {
            setError(err.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="create_product_container">
            <SideMenu />
            <Box className="create_product_form">
                <h2>Créer un nouveau produit</h2>
                <form className='form' onSubmit={handleSubmit}>
                    
                    {/* Image du produit */}
                    <Box sx={{ marginTop: 2, padding: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
                        <h4 style={{ marginTop: 0 }}>Image du produit</h4>

                        {/* Option 1 : coller URL depuis la bibliothèque */}
                        <TextField
                            fullWidth
                            label="Coller l'URL depuis la bibliothèque médias"
                            value={image}
                            onChange={(e) => {
                                setImage(e.target.value);
                                setImagePreview(e.target.value);
                            }}
                            size="small"
                            sx={{ marginBottom: 2 }}
                            placeholder="https://res.cloudinary.com/..."
                            disabled={uploadPicture || loading}
                        />

                        {/* Option 2 : uploader une nouvelle image */}
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="image-upload"
                            type="file"
                            onChange={handleImageUpload}
                            disabled={uploadPicture}
                        />
                        <label htmlFor="image-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                disabled={uploadPicture || loading}
                                sx={{ padding: '10px' }}
                            >
                                {uploadPicture ? '📤 Upload en cours...' : '🖼️ Uploader une nouvelle image'}
                            </Button>
                        </label>

                        {uploadPicture && <LinearProgress sx={{ marginTop: 1 }} />}

                        {/* Aperçu */}
                        {imagePreview && (
                            <Box sx={{ marginTop: 2 }}>
                                <img
                                    src={imagePreview}
                                    alt="aperçu"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                            </Box>
                        )}

                        {image && !uploadPicture && (
                            <Typography sx={{ marginTop: 1, color: 'green', fontSize: '0.9rem' }}>
                                ✅ Image prête
                            </Typography>
                        )}
                    </Box>
                    
                    <TextField className='input_product' fullWidth label="Nom du produit" margin="normal" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} required />
                    <TextField className='input_product' fullWidth label="Notice (courte description)" margin="normal" value={notice} onChange={(e) => setNotice(e.target.value)} disabled={loading} required />
                    <TextField className='input_product' fullWidth label="Contenu (texte complet)" margin="normal" value={content} onChange={(e) => setContent(e.target.value)} disabled={loading} required />
                    <TextField className='input_product' fullWidth label="Description complète" margin="normal" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} required />
                    <TextField className='input_product' fullWidth label="Prix" margin="normal" value={price} onChange={(e) => setPrice(e.target.value)} disabled={loading} required />
                    
                    <TextField className='input_product' fullWidth label="Catégorie" select margin="normal" value={categories} onChange={(e) => setCategories(e.target.value)} disabled={loading} required>
                        {categoriesOptions.map((option) => (
                            <MenuItem key={option.id} value={option.value}>{option.label}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        className='input_product'
                        fullWidth
                        label="URL du fichier (Google Drive)"
                        margin="normal"
                        value={fileUrl}
                        onChange={(e) => setFileUrl(convertDriveUrl(e.target.value))}
                        disabled={loading}
                        placeholder="Colle ton lien Google Drive ici"
                        helperText={fileUrl ? '✅ Lien prêt au téléchargement' : ''}
                    />

                    {error && <Box sx={{ color: 'red', marginTop: '10px' }}>{error}</Box>}

                    <Button className="basket_button" fullWidth type="submit" variant="contained" disabled={loading} sx={{ marginTop: '20px' }}>
                        {loading ? 'Création...' : 'Ajouter le produit'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
}
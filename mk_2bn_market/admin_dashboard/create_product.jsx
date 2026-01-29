import { Box, Button, TextField, MenuItem, LinearProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { createProduct } from './services/productService';
import SideMenu from './services/side_menu';
import { API_URL } from '../src/config/api';
import './dashboard.css';

export default function CreateProduct() {
    const [image, setImage] = useState('');
    const [uploadPicture, setUploadPicture] = useState('');
    const [name, setName] = useState('');
    const [notice, setNotice] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(false);
    const [error, setError] = useState('');

    const categoriesOptions = [
        { label: 'Xls', value: 'documents', id: 'xls' },
        { label: 'Documents', value: 'documents', id: 'doc' },
        { label: 'Vidéos', value: 'Media', id: 'media' },
        { label: 'Word', value: 'documents', id: 'word' },
        { label: 'Formations', value: 'formations', id: 'form' },
        { label: 'Outils', value: 'outils', id: 'outils' },
    ];

    //fonction pour l'upload des images de produits
const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadPicture(true);
    setError('');

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'Images'); // ← Catégorie pour les images

        // Même route que les fichiers
        const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            setImage(data.fileUrl); // ← Stocker l'URL
            alert('Image uploadée avec succès !');
        } else {
            throw new Error(data.error || 'Erreur upload image');
        }

    } catch (err) {
        console.error(' Erreur image:', err);
        setError(err.message);
        alert(' Erreur : ' + err.message);
    } finally {
        setUploadPicture(false);
    }
};


    // ✅ Fonction pour uploader le fichier
const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('🔍 Fichier sélectionné:', file.name);

    setUploadProgress(true);
    setError('');

    try {
        const folderMap = {
            'documents': 'Documents',
            'Media': 'Media',
            'formations': 'Livres',
            'outils': 'Templates'
        };

        const category = folderMap[categories] || 'Autres';
        console.log('🔍 Categories state:', categories);
        console.log('🔍 Catégorie mappée:', category);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        console.log('🔍 Envoi vers: ', `${API_URL}/api/upload`);

        const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        console.log('🔍 Response status:', response.status);
        console.log('🔍 Response OK?:', response.ok);

        const data = await response.json();
        console.log('🔍 Data reçue:', data);

        if (data.success) {
            setFileUrl(data.fileUrl);
            setFileName(data.fileName);
            alert('Fichier uploadé avec succès !');
        } else {
            throw new Error(data.error || 'Erreur lors de l\'upload');
        }

    } catch (err) {
        console.error('Erreur complète:', err);
        setError(err.message);
        alert('Erreur : ' + err.message);
    } finally {
        setUploadProgress(false);
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
                fileUrl
            };

            await createProduct(productData);

            setImage('');
            setName('');
            setNotice('');
            setDescription('');
            setPrice('');
            setCategories('');
            setFileUrl('');
            setFileName('');
            
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
                    
                    <Box sx={{ marginTop: 2 }}>
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
                                disabled={uploadPicture}
                                sx={{ padding: '10px' }}
                            >
                                {uploadPicture ? '📤 Upload en cours...' : '🖼️ Choisir une image'}
                            </Button>
                        </label>
                        {uploadPicture && <LinearProgress sx={{ marginTop: 1 }} />}
                        {image && (
                            <Typography sx={{ marginTop: 1, color: 'green', fontSize: '0.9rem' }}>
                                ✅ Image uploadée avec succès !
                            </Typography>
                        )}
                    </Box>
                    
                    <TextField 
                        className='input_product' 
                        fullWidth 
                        label="Nom du produit" 
                        margin="normal" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        required 
                    />
                    
                    <TextField 
                        className='input_product' 
                        fullWidth 
                        label="Notice (courte description)" 
                        margin="normal"
                        value={notice}
                        onChange={(e) => setNotice(e.target.value)}
                        disabled={loading}
                        required 
                    />
                    
                    <TextField 
                        className='input_product' 
                        fullWidth 
                        label="Description complète" 
                        margin="normal" 
                        multiline 
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        required 
                    />
                    
                    <TextField 
                        className='input_product' 
                        fullWidth 
                        label="Prix" 
                        margin="normal"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled={loading}
                        required 
                    />
                    
                    <TextField 
                        className='input_product' 
                        fullWidth 
                        label="Catégorie" 
                        select 
                        margin="normal"
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                        disabled={loading}
                        required
                    >
                        {categoriesOptions.map((option) => (
                            <MenuItem key={option.id} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* ✅ BOUTON D'UPLOAD */}
                    <Box sx={{ marginTop: 2 }}>
                        <input
                            accept=".pdf,.zip,.docx,.xlsx,.doc,.xls"
                            style={{ display: 'none' }}
                            id="file-upload"
                            type="file"
                            onChange={handleFileUpload}
                            disabled={!categories || uploadProgress}
                        />
                        <label htmlFor="file-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                disabled={!categories || uploadProgress}
                                sx={{ padding: '10px' }}
                            >
                                {uploadProgress ? '📤 Upload en cours...' : '📁 Choisir un fichier'}
                            </Button>
                        </label>
                        
                        {uploadProgress && <LinearProgress sx={{ marginTop: 1 }} />}
                        
                        {fileName && (
                            <Typography sx={{ marginTop: 1, color: 'green', fontSize: '0.9rem' }}>
                                ✅ Fichier uploadé : {fileName}
                            </Typography>
                        )}
                        
                        {!categories && (
                            <Typography sx={{ marginTop: 1, color: 'orange', fontSize: '0.85rem' }}>
                                ⚠️ Sélectionne d'abord une catégorie
                            </Typography>
                        )}
                    </Box>

                    {error && (
                        <Box sx={{ color: 'red', marginTop: '10px' }}>
                            {error}
                        </Box>
                    )}

                    <Button 
                        className="basket_button" 
                        fullWidth 
                        type="submit" 
                        variant="contained" 
                        disabled={loading}
                        sx={{ marginTop: '20px' }}
                    >
                        {loading ? 'Création...' : 'Ajouter le produit'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
}
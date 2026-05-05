import { Box, Button, TextField, Card, CardContent, LinearProgress, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import { getAllProducts, updateProduct, uploadFile } from './services/getAllProducts';
import SideMenu from './services/side_menu';
import { API_URL } from '../src/config/api';
import './dashboard.css';

export default function EditProduct() {
    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        notice: '',
        categories: '',
        fileUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await getAllProducts();
        setProducts(data);
    };

    const handleEdit = (product) => {
        setEditing(product._id);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            notice: product.notice,
            categories: product.categories,
            fileUrl: product.fileUrl || ''
        });
        setSelectedFile(null);
        setSelectedImage(null);
        setImagePreview(product.image || '');
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setUploadingImage(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('category', 'Images');

            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formDataUpload
            });

            const data = await response.json();

            if (data.success) {
                setFormData(prev => ({ ...prev, image: data.fileUrl }));
            } else {
                throw new Error(data.error || 'Erreur upload image');
            }
        } catch (err) {
            alert('Erreur upload image : ' + err.message);
            setSelectedImage(null);
            setImagePreview(formData.image);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let updatedData = { ...formData };

            if (selectedFile) {
                const uploadResult = await uploadFile(selectedFile, formData.categories);
                updatedData.fileUrl = uploadResult.fileUrl;
            }

            await updateProduct(editing, updatedData);
            setEditing(null);
            setSelectedFile(null);
            setSelectedImage(null);
            setImagePreview('');
            await loadProducts();
            alert('Produit modifié ! ✅');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la modification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <SideMenu />
            <Box className="admin_edit_product_container">
                <h2>Modifier les Produits</h2>
                <Box className="admin_edit_product_list">
                    {products.map((product) => (
                        <Card className="list_product" key={product._id} sx={{ marginBottom: 2, padding: 2 }}>
                            <CardContent>
                                {editing === product._id ? (
                                    <form onSubmit={handleSubmit}>

                                        {/* Image du produit */}
                                        <Box sx={{ marginBottom: 2, padding: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
                                            <h4 style={{ marginTop: 0 }}>Image du produit</h4>

                                            {/* Option 1 : coller URL depuis la bibliothèque */}
                                            <TextField
                                                fullWidth
                                                label="Coller l'URL depuis la bibliothèque médias"
                                                value={formData.image}
                                                onChange={(e) => {
                                                    setFormData(prev => ({ ...prev, image: e.target.value }));
                                                    setImagePreview(e.target.value);
                                                }}
                                                size="small"
                                                sx={{ marginBottom: 2 }}
                                                placeholder="https://res.cloudinary.com/..."
                                                disabled={uploadingImage || loading}
                                            />

                                            {/* Option 2 : uploader une nouvelle image */}
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="edit-image-upload"
                                                type="file"
                                                onChange={handleImageChange}
                                                disabled={uploadingImage || loading}
                                            />
                                            <label htmlFor="edit-image-upload">
                                                <Button
                                                    variant="outlined"
                                                    component="span"
                                                    disabled={uploadingImage || loading}
                                                    size="small"
                                                >
                                                    {uploadingImage ? '📤 Upload en cours...' : '🖼️ Uploader une nouvelle image'}
                                                </Button>
                                            </label>

                                            {uploadingImage && <LinearProgress sx={{ marginTop: 1 }} />}

                                            {selectedImage && !uploadingImage && (
                                                <Typography sx={{ marginTop: 1, color: 'green', fontSize: '0.85rem' }}>
                                                    ✅ Image mise à jour
                                                </Typography>
                                            )}

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
                                        </Box>

                                        <TextField fullWidth label="Nom" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} margin="normal" disabled={loading} />
                                        <TextField fullWidth label="Prix" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} margin="normal" disabled={loading} />
                                        <TextField fullWidth label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} margin="normal" multiline rows={3} disabled={loading} />
                                        <TextField fullWidth label="Notice" value={formData.notice} onChange={(e) => setFormData({ ...formData, notice: e.target.value })} margin="normal" disabled={loading} />
                                        <TextField fullWidth label="Catégorie" value={formData.categories} onChange={(e) => setFormData({ ...formData, categories: e.target.value })} margin="normal" disabled={loading} />

                                        {/* Fichier téléchargeable */}
                                        <Box sx={{ marginTop: 2, marginBottom: 2, padding: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
                                            <h4 style={{ marginTop: 0 }}>Fichier téléchargeable</h4>
                                            {formData.fileUrl && (
                                                <Box sx={{ marginBottom: 2, color: 'green', fontSize: '0.85rem' }}>
                                                    ✅ Fichier actuel : {formData.fileUrl}
                                                </Box>
                                            )}
                                            <input type="file" onChange={handleFileChange} disabled={loading} style={{ marginTop: '10px' }} />
                                            {selectedFile && (
                                                <Box sx={{ marginTop: 1, color: 'blue', fontSize: '0.85rem' }}>
                                                    📎 Nouveau fichier : {selectedFile.name}
                                                </Box>
                                            )}
                                        </Box>

                                        <Box sx={{ marginTop: 2 }}>
                                            <Button type="submit" variant="contained" disabled={loading || uploadingImage}>
                                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                                            </Button>
                                            <Button onClick={() => setEditing(null)} sx={{ marginLeft: 2 }} disabled={loading}>
                                                Annuler
                                            </Button>
                                        </Box>
                                    </form>
                                ) : (
                                    <>
                                        {product.image && (
                                            <img src={product.image} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                                        )}
                                        <h3>{product.name}</h3>
                                        <p><strong>Prix:</strong> {product.price}</p>
                                        <p><strong>Description:</strong> {product.description}</p>
                                        <p><strong>Catégorie:</strong> {product.categories}</p>
                                        {product.fileUrl
                                            ? <p><strong>Fichier:</strong> ✅ {product.fileUrl}</p>
                                            : <p><strong>Fichier:</strong> ❌ Aucun</p>
                                        }
                                        <Button variant="outlined" onClick={() => handleEdit(product)}>Modifier</Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
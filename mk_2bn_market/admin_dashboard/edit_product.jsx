import { Box, Button, TextField, Card, CardContent } from "@mui/material";
import { useState, useEffect } from 'react';
import { getAllProducts, updateProduct, uploadFile } from './services/getAllProducts';
import SideMenu from './services/side_menu';
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

    // Charge tous les produits au démarrage
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await getAllProducts();
        setProducts(data);
    };

    // Active le mode modification
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
    };

        const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Envoie les modifications
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let updatedData = { ...formData };

            // Si un nouveau fichier est sélectionné, l'uploader d'abord
            if (selectedFile) {
                const uploadResult = await uploadFile(selectedFile, formData.categories);
                updatedData.fileUrl = uploadResult.fileUrl;
            }

            await updateProduct(editing, updatedData);
            setEditing(null);
            setSelectedFile(null);
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
        <Box >
            <SideMenu />
            <Box className="admin_edit_product_container">
                <h2>Modifier les Produits</h2>
                <Box className="admin_edit_product_list">
                    {products.map((product) => (
                    <Card className="list_product" key={product._id} sx={{ marginBottom: 2, padding: 2 }}>
                        <CardContent>
                            {editing === product._id ? (
                                // Formulaire de modification
                                <form onSubmit={handleSubmit}>
                                    <TextField 
                                        fullWidth 
                                        label="Nom" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        margin="normal"
                                        disabled={loading}
                                    />
                                    <TextField 
                                        fullWidth 
                                        label="Prix" 
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        margin="normal"
                                        disabled={loading}
                                    />
                                    <TextField 
                                        fullWidth 
                                        label="Description" 
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        margin="normal"
                                        multiline
                                        rows={3}
                                        disabled={loading}
                                    />
                                    <TextField 
                                        fullWidth 
                                        label="Image" 
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        margin="normal"
                                        disabled={loading}
                                    />
                                    <TextField 
                                        fullWidth 
                                        label="Notice" 
                                        value={formData.notice}
                                        onChange={(e) => setFormData({ ...formData, notice: e.target.value })}
                                        margin="normal"
                                        disabled={loading}
                                    />
                                    <TextField 
                                        fullWidth 
                                        label="Catégorie" 
                                        value={formData.categories}
                                        onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                                        margin="normal"
                                        disabled={loading}
                                    />

                                    <Box sx={{ marginTop: 2, marginBottom: 2, padding: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
                                        <h4>Fichier téléchargeable</h4>
                                        
                                        {formData.fileUrl && (
                                            <Box sx={{ marginBottom: 2, color: 'green' }}>
                                                ✅ Fichier actuel : {formData.fileUrl}
                                            </Box>
                                        )}
                                        
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            disabled={loading}
                                            style={{ marginTop: '10px' }}
                                        />
                                        
                                        {selectedFile && (
                                            <Box sx={{ marginTop: 1, color: 'blue' }}>
                                                📎 Nouveau fichier sélectionné : {selectedFile.name}
                                            </Box>
                                        )}
                                    </Box>


                                    <Box sx={{ marginTop: 2 }}>
                                        <Button 
                                            type="submit" 
                                            variant="contained" 
                                            disabled={loading}
                                        >
                                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                                        </Button>
                                        <Button 
                                            onClick={() => setEditing(null)} 
                                            sx={{ marginLeft: 2 }}
                                            disabled={loading}
                                        >
                                            Annuler
                                        </Button>
                                    </Box>
                                </form>
                            ) : (
                                // Affichage normal
                                <>
                                    <h3>{product.name}</h3>
                                    <p><strong>Prix:</strong> {product.price}</p>
                                    <p><strong>Description:</strong> {product.description}</p>
                                    <p><strong>Catégorie:</strong> {product.categories}</p>
                                    {product.fileUrl && (
                                        <p><strong>Fichier:</strong> ✅ {product.fileUrl}</p>
                                    )}
                                    {!product.fileUrl && (
                                        <p><strong>Fichier:</strong> ❌ Aucun</p>
                                    )}
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => handleEdit(product)}
                                    >
                                        Modifier
                                    </Button>
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
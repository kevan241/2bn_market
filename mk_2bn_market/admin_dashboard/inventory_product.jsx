import { Box, Button, Card, CardContent, Grid } from "@mui/material";
import { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct } from './services/productService';
import SideMenu from "./services/side_menu";

export default function InventoryProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Charge les produits au démarrage
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            alert('Erreur lors du chargement des produits');
        } finally {
            setLoading(false);
        }
    };

    // Supprime un produit
    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            setLoading(true);
            try {
                await deleteProduct(id);
                await loadProducts();
                alert('Produit supprimé ! ✅');
            } catch (error) {
                alert('Erreur lors de la suppression');
            } finally {
                setLoading(false);
            }
        }
    };

    const getImagePath = (imagePath) => {
    if (!imagePath) return '';
    
    // Si l'image commence déjà par ../ → ne rien changer
    if (imagePath.startsWith('../')) {
        return imagePath;
    }
    
    // Si l'image commence par ./ → remplacer par ../
    if (imagePath.startsWith('./')) {
        return imagePath.replace(/^\.\//, '../');
    }
    
    // Si l'image commence par img/ → ajouter ../
    if (imagePath.startsWith('img/')) {
        return `../${imagePath}`;
    }
    
    // Sinon retourner tel quel
    return imagePath;
};

    return (
        <Box className="admin_dashboard_service_container">
            <SideMenu />
            <Box className="delete_product_container">
                <h2>Gestion des Produits en Inventaire</h2>

                {loading && <p>Chargement...</p>}

                <Grid className="delete_product_grid" container spacing={2} sx={{ marginTop: 2 }}>
                    {products.map((product) => (
                        <Grid className="product_to_delete" key={product._id}>
                            <Card className="product_deleted">
                                <CardContent className="element_to_delete">
                                    <img getImagePath
                                        src={getImagePath(product.image)} 
                                        alt={product.name} 
                                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                    />
                                    <Box sx={{display:'flex',flexDirection:'column',justifyContent:'end'}}>
                                        <h3>{product.name}</h3>
                                        <p><strong>Prix:</strong> {product.price}</p>
                                        <Button 
                                            variant="outlined" 
                                            color="error"
                                            fullWidth
                                            onClick={() => handleDelete(product._id)}
                                            disabled={loading}>Supprimer
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {products.length === 0 && !loading && (
                    <p>Aucun produit en inventaire</p>
                )}
            </Box>
        </Box>
    );
}
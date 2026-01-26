import { Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getProducts } from "./services/productServices";
import '../custome.css';

export default function Products({ onAddToBasket }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts().then(data => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Chargement des produits...</div>;

    return (
        <Box className="products_container">
            <h2 aria-label="Documents" datatype="documents documents_word">Nos Produits</h2>
            <Box className="products_list" sx={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '30px' }}>
                {products.map(product => (
                    <div className="product_container" key={product._id}>
                        <div 
                            className="product_img" 
                            onClick={() => navigate(`/product/${product._id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={product.image} alt={product.name} width='100%' />
                        </div>
                        <div className="details_product">
                            <h3>{product.name}</h3>
                            <p className="price">{product.price}</p>
                            <p className="notice">{product.notice}</p>
                            <p className="description">{product.description}</p>
                            <Button className="basket_button" onClick={() => onAddToBasket(product)}>Mettre dans le panier</Button>
                        </div>
                    </div>
                ))}
            </Box>
        </Box>
    )
}
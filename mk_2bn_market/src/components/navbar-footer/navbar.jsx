import { Box, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

import RemoveProduct from '../../../public/img/icons/remove.png';
import basket from '../../../public/img/icons/panier.png';

import PaymentForm from '../checkout/ebilling_paiement';

import "../../custome.css";

export default function Navbar({ count, items, onRemoveItem }) {
    const [showBasket, setShowBasket] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    // ✅ Utilise un vrai ObjectId Mongo (premier produit du panier)
    const basketProduct = items.length > 0 ? {
        _id: items[0]._id,
        name: 'Paiement du panier',
        description: 'Paiement global des produits du panier',
        price: items.reduce(
            (total, item) => total + parseInt(item.price),
            0
        )
    } : null;

    return (
        <Box className="navbar_main_container">
            <Box className="navbar_container">
                <div className="logo_marketplace">
                    <h2>2BN Marketplace</h2>
                </div>

                <div className="pages_link">
                    <Link to="/">Accueil</Link>
                    <Link to="/explore">Vidéos</Link>
                    <Link to="/create">Documents</Link>
                    <Link to="/profile">Evenements</Link>
                </div>

                <div className="search">
                    <TextField placeholder="Rechercher une formation" />
                </div>

                <div className="log-sub">
                    <span>Inscription</span>
                    <span>Connexion</span>
                    <div
                        className="basket"
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onClick={() => setShowBasket(!showBasket)}
                    >
                        <span>
                            <img src={basket} alt="basket_icon" width="80%" />
                        </span>
                        <div className="basket_count">{count}</div>
                    </div>
                </div>
            </Box>

            <Box
                className="basket_products"
                sx={{ display: showBasket ? 'block' : 'none' }}
            >
                <div className="title_products_basket">
                    <h3>Produits dans le panier</h3>
                </div>

                <div className="products_list">
                    {items.length === 0 ? (
                        <p>Aucun produit dans le panier</p>
                    ) : (
                        items.map(item => (
                            <div className="basket_items" key={item._id}>
                                <div className="product">
                                    <p className="product_name">{item.name}</p>
                                    <p className="product_price">{item.price}</p>
                                </div>
                                <div className="remove_product">
                                    <img
                                        src={RemoveProduct}
                                        onClick={() => onRemoveItem(item._id)}
                                        alt="remove_icon"
                                        width="50%"
                                    />
                                </div>
                            </div>
                        ))
                    )}

                    {items.length > 0 && basketProduct && (
                        <div className="total_checkout_section">
                            <div className="total_amount">
                                <p>Total : {basketProduct.price} Fcfa</p>
                            </div>

                            <div className="checkout_container">
                                {!showPaymentForm ? (
                                    <Button
                                        className="checkout_button"
                                        onClick={() => setShowPaymentForm(true)}
                                    >
                                        Valider le paiement
                                    </Button>
                                ) : (
                                    <Box sx={{ marginTop: 2 }}>
                                        <PaymentForm product={basketProduct} />
                                        <Button
                                            fullWidth
                                            onClick={() => setShowPaymentForm(false)}
                                            sx={{ marginTop: 2 }}
                                        >
                                            ← Annuler
                                        </Button>
                                    </Box>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Box>
        </Box>
    );
}

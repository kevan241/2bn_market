import { Box, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import RemoveProduct from '../../../public/img/icons/remove.png';
import basket from '../../../public/img/icons/panier.png';

import PaymentForm from '../checkout/ebilling_paiement';

import "../../custome.css";

export default function Navbar({ count, items, onRemoveItem }) {
    const [showBasket, setShowBasket] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Ferme le menu si on redimensionne au-dessus de 414px
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 414) setMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Empêche le scroll quand le menu est ouvert
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

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
        <>
            <style>{`
                /* ───── Hamburger styles (mobile only) ───── */
                @media (max-width: 414px) {

                    .navbar_container .pages_link,
                    .navbar_container .search,
                    .navbar_container .desktop_only {
                        display: none !important;
                    }

                    /* Bouton hamburger */
                    .hamburger_btn {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        gap: 5px;
                        cursor: pointer;
                        background: none;
                        border: none;
                        padding: 6px;
                        z-index: 1100;
                        position: relative;
                    }

                    .hamburger_btn span {
                        display: block;
                        width: 24px;
                        height: 2px;
                        background: rgb(255 255 255);
                        border-radius: 2px;
                        transition: transform 0.3s ease, opacity 0.3s ease;
                        transform-origin: center;
                    }

                    /* Animation croix quand ouvert */
                    .hamburger_btn.open span:nth-child(1) {
                        transform: translateY(7px) rotate(45deg);
                    }
                    .hamburger_btn.open span:nth-child(2) {
                        opacity: 0;
                        transform: scaleX(0);
                    }
                    .hamburger_btn.open span:nth-child(3) {
                        transform: translateY(-7px) rotate(-45deg);
                    }

                    /* Overlay sombre derrière le drawer */
                    .menu_overlay {
                        display: block;
                        position: fixed;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.45);
                        z-index: 1000;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.3s ease;
                    }
                    .menu_overlay.open {
                        opacity: 1;
                        pointer-events: all;
                    }

                    /* Drawer latéral (de droite vers gauche) */
                    .mobile_drawer {
                        position: fixed;
                        top: 0;
                        right: 0;
                        height: 100%;
                        width: 75%;
                        max-width: 300px;
                        background: #fff;
                        z-index: 1050;
                        transform: translateX(100%);
                        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        flex-direction: column;
                        padding: 72px 28px 32px;
                        box-shadow: -4px 0 24px rgba(0,0,0,0.15);
                        overflow-y: auto;
                    }
                    .mobile_drawer.open {
                        transform: translateX(0);
                    }

                    /* Liens dans le drawer */
                    .mobile_drawer a {
                        display: block;
                        font-size: 1.15rem;
                        font-weight: 600;
                        color: #222;
                        text-decoration: none;
                        padding: 14px 0;
                        border-bottom: 1px solid #f0f0f0;
                        transition: color 0.2s;
                    }
                    .mobile_drawer a:last-child {
                        border-bottom: none;
                    }
                    .mobile_drawer a:hover {
                        color: #1976d2;
                    }

                    /* Sections auth dans le drawer */
                    .mobile_drawer_auth {
                        margin-top: 28px;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        border-top: 1px solid #f0f0f0;
                        padding-top: 20px;
                    }
                    .mobile_drawer_auth span {
                        font-size: 0.95rem;
                        font-weight: 500;
                        color: #555;
                        cursor: pointer;
                        padding: 10px 0;
                        border-bottom: 1px solid #f0f0f0;
                    }

                    /* Barre de recherche dans le drawer */
                    .mobile_drawer_search {
                        margin-bottom: 20px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #f0f0f0;
                    }
                    .mobile_drawer_search .MuiTextField-root {
                        width: 100%;
                    }
                }

                /* ───── Cache le bouton hamburger sur desktop ───── */
                @media (min-width: 415px) {
                    .hamburger_btn {
                        display: none !important;
                    }
                    .mobile_drawer,
                    .menu_overlay {
                        display: none !important;
                    }
                }
            `}</style>

            <Box className="navbar_main_container">
                <Box className="navbar_container">
                    <div className="logo_marketplace">
                        <h2>2BN Marketplace</h2>
                    </div>

                    {/* Menu classique — visible sur desktop uniquement */}
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
                        {/* Auth — masqué sur mobile (visible dans le drawer) */}
                        <span className="desktop_only">Inscription</span>
                        <span className="desktop_only">Connexion</span>

                        {/* Panier */}
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

                        {/* Bouton hamburger — visible sur mobile uniquement */}
                        <button
                            className={`hamburger_btn ${menuOpen ? 'open' : ''}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                            aria-expanded={menuOpen}
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>
                </Box>

                {/* Panier déroulant */}
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

            {/* Overlay cliquable pour fermer le drawer */}
            <div
                className={`menu_overlay ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
            />

            {/* Drawer mobile — s'ouvre de droite à gauche */}
            <nav
                className={`mobile_drawer ${menuOpen ? 'open' : ''}`}
                aria-label="Menu mobile"
            >
                {/* Barre de recherche */}
                <div className="mobile_drawer_search">
                    <TextField placeholder="Rechercher une formation" />
                </div>

                {/* Liens de navigation */}
                <Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
                <Link to="/explore" onClick={() => setMenuOpen(false)}>Vidéos</Link>
                <Link to="/create" onClick={() => setMenuOpen(false)}>Documents</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Evenements</Link>

                {/* Auth */}
                <div className="mobile_drawer_auth">
                    <span>Inscription</span>
                    <span>Connexion</span>
                </div>
            </nav>
        </>
    );
}
import Home from "./components/home";
import {Route, Routes} from "react-router-dom"; 
import { useState, useEffect } from "react";
import Product_file from "./components/product_profil";
import Navbar from "./components/navbar-footer/navbar";
import Footer from "./components/navbar-footer/footer";
import EbillingPaiement from "./components/checkout/ebilling_paiement";
import PaymentSuccess from './components/payment-success';
import './custome.css'

export default function App() {
  const [basketCount, setBasketCount] = useState(() => {
    const saved = localStorage.getItem('basketCount');
    return saved ? parseInt(saved) : 0;
  });
  const [basketItems, setBasketItems] = useState(() => {
    const saved = localStorage.getItem('basketItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('basketCount', basketCount.toString());
    localStorage.setItem('basketItems', JSON.stringify(basketItems));
  }, [basketCount, basketItems]);

  const addToBasket = (product) => {
    const newItems = [...basketItems, product];
    setBasketItems(newItems);
    setBasketCount(newItems.length);
  }

  const removeFromBasket = (productId) => {
    const updatedItems = basketItems.filter(item => item._id !== productId);
    setBasketItems(updatedItems);
    setBasketCount(updatedItems.length);
  }
  
  return (
    <>
      <Navbar count={basketCount} items={basketItems} onRemoveItem={removeFromBasket} />
      <Routes>
        <Route path="/" element={<Home onAddToBasket={addToBasket} />} />
        <Route path="/product/:id" element={<Product_file/>} />
        <Route path="/payment" element={<EbillingPaiement />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
      <Footer />
    </>
  );
}
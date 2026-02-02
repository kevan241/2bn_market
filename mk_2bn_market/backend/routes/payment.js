const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/transaction');

const EBILLING_BASE_URL = 'https://lab.billing-easy.net/api/v1/merchant/e_bills.json';
const EBILLING_USERNAME = process.env.EBILLING_USERNAME || '2bni';
const EBILLING_SHAREDKEY = process.env.EBILLING_SHAREDKEY || '8d08402e-714f-445a-bd7d-75c982b54ba8';

// ✅ Variables d'environnement
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

function getAuthHeader() {
  const token = Buffer.from(`${EBILLING_USERNAME}:${EBILLING_SHAREDKEY}`).toString('base64');
  return `Basic ${token}`;
}

router.post('/create-ebill', async (req, res) => {
  console.log('🔥 ROUTE APPELÉE');
  console.log('📥 Body:', req.body);
  
  try {
    const { payer_msisdn, payer_email, amount, productId, productName } = req.body;

    const external_reference = `${productId}-${Date.now()}`;

    const payload = {
      payer_msisdn: payer_msisdn,
      payer_email: payer_email,
      amount: amount,
      currency: "XAF",
      short_description: `Achat de ${productName}`,
      description: `Achat de ${productName}`,
      external_reference: external_reference,
      expiry_period: "60"
    };

    console.log('📤 Envoi vers Ebilling:', payload);

    const response = await axios.post(
      EBILLING_BASE_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader(),
        },
      }
    );

    console.log('📥 Réponse Ebilling:', response.data);

    if (response.data.e_bill && response.data.e_bill.bill_id) {
      const bill_id = response.data.e_bill.bill_id;
      console.log('✅ E-bill créé:', bill_id);
      
      // ✅ Enregistre la transaction en base
      await Transaction.create({
        productId: productId,
        userId: payer_email,
        ebill_id: bill_id,
        external_reference: external_reference,
        amount: amount,
        payer_msisdn: payer_msisdn,
        payer_email: payer_email,
        status: 'pending'
      });
      
      // ✅ redirect_url pointe vers le BACKEND
      const payment_url = `https://test.billing-easy.net/?invoice=${bill_id}&redirect_url=${BACKEND_URL}/api/payment/return`;

      console.log('🔗 URL de paiement:', payment_url);
      
      res.json({
        success: true,
        payment_url: payment_url,
        ebill_id: bill_id
      });
    } else {
      throw new Error('Pas de bill_id dans la réponse');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) {
      console.error('Erreur API:', error.response.data);
    }
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ✅ Callback serveur-à-serveur (Ebilling envoie la confirmation ici)
router.post('/callback', async (req, res) => {
  console.log('📥 Callback Ebilling reçu:', req.body);
  
  try {
    const { e_bill, transaction } = req.body;
    
    if (transaction && transaction.status === 'SUCCESS') {
      console.log('✅ Paiement réussi !');
      
      // Trouve et met à jour la transaction
      const dbTransaction = await Transaction.findOne({ ebill_id: e_bill.bill_id });
      
      if (dbTransaction) {
        dbTransaction.status = 'paid';
        dbTransaction.paid_at = new Date();
        await dbTransaction.save();
        console.log('💾 Transaction mise à jour:', dbTransaction._id);
      }
    } else {
      console.log('❌ Paiement échoué ou en attente');
    }
    
    res.status(200).json({ status: 'received' });
  } catch (error) {
    console.error('❌ Erreur callback:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Retour utilisateur (après paiement)
router.get('/return', async (req, res) => {
  console.log('🔙 Retour utilisateur');
  console.log('📋 Query params:', req.query);
  console.log('📋 Full URL:', req.url);
  
  try {
    // Essaye de récupérer le bill_id de plusieurs manières
    const bill_id = req.query.invoice || req.query.bill_id || req.query.bill;
    
    console.log('🔍 bill_id trouvé:', bill_id);
    
    if (bill_id) {
      // Trouve la transaction correspondante
      const transaction = await Transaction.findOne({ ebill_id: bill_id });
      
      if (transaction) {
        console.log('✅ Transaction trouvée:', transaction.productId);
        
        // ✅ Redirige vers le FRONTEND
        res.redirect(`${FRONTEND_URL}/product/${transaction.productId}?payment=success`);
        return;
      } else {
        console.log('❌ Transaction non trouvée pour bill_id:', bill_id);
      }
    } else {
      console.log('⚠️ Aucun bill_id dans les query params');
    }
    
    // Si pas de transaction trouvée, redirige vers la page de succès avec un flag
    res.redirect(`${FRONTEND_URL}/payment-success?completed=true`);
    
  } catch (error) {
    console.error('❌ Erreur retour:', error);
    res.redirect(`${FRONTEND_URL}/payment-success?error=true`);
  }
});

// ✅ Nouvelle route : Vérifier si un produit a été payé par un utilisateur
router.get('/check-payment/:productId/:userEmail', async (req, res) => {
  try {
    const { productId, userEmail } = req.params;
    
    const transaction = await Transaction.findOne({
      productId: productId,
      userId: userEmail,
      status: 'paid'
    });
    
    res.json({
      hasPaid: !!transaction,
      transaction: transaction
    });
  } catch (error) {
    console.error('❌ Erreur vérification:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
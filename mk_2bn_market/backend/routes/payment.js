const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/transaction');

const EBILLING_BASE_URL = 'https://lab.billing-easy.net/api/v1/merchant/e_bills.json';
const EBILLING_USERNAME = process.env.EBILLING_USERNAME || '2bni';
const EBILLING_SHAREDKEY = process.env.EBILLING_SHAREDKEY || '8d08402e-714f-445a-bd7d-75c982b54ba8';

const BACKEND_URL = process.env.BACKEND_URL || 'https://twobn-market.onrender.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://2bn-market-55ud.vercel.app';

function getAuthHeader() {
  const token = Buffer.from(`${EBILLING_USERNAME}:${EBILLING_SHAREDKEY}`).toString('base64');
  return `Basic ${token}`;
}

router.post('/create-ebill', async (req, res) => {
  console.log('🔥 ROUTE APPELÉE');
  console.log('📥 Body:', req.body);
  
  try {
    const { payer_msisdn, payer_email, amount, productId, productName } = req.body;

    if (!payer_msisdn || !payer_email || !amount || !productId || !productName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Données manquantes' 
      });
    }

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

router.post('/callback', async (req, res) => {
  console.log('📥 Callback Ebilling reçu:', req.body);
  
  try {
    const { e_bill, transaction } = req.body;
    
    if (!e_bill || !e_bill.bill_id) {
      console.log('⚠️ Pas de bill_id dans le callback');
      return res.status(400).json({ error: 'bill_id manquant' });
    }

    const dbTransaction = await Transaction.findOne({ ebill_id: e_bill.bill_id });
    
    if (!dbTransaction) {
      console.log('❌ Transaction non trouvée pour bill_id:', e_bill.bill_id);
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    if (transaction && transaction.status === 'SUCCESS') {
      console.log('✅ Paiement réussi !');
      dbTransaction.status = 'success';
      dbTransaction.paid_at = new Date();
      await dbTransaction.save();
      console.log('💾 Transaction mise à jour:', dbTransaction._id);
    } else if (transaction && transaction.status === 'FAILED') {
      console.log('❌ Paiement échoué');
      dbTransaction.status = 'failed';
      await dbTransaction.save();
    } else if (transaction && transaction.status === 'CANCELLED') {
      console.log('❌ Paiement annulé');
      dbTransaction.status = 'cancelled';
      await dbTransaction.save();
    } else {
      console.log('⏳ Paiement en attente');
      dbTransaction.status = 'pending';
      await dbTransaction.save();
    }
    
    res.status(200).json({ status: 'received' });
  } catch (error) {
    console.error('❌ Erreur callback:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/return', async (req, res) => {
  console.log('🔙 Retour utilisateur');
  console.log('📋 Query params:', req.query);
  console.log('📋 Full URL:', req.url);
  
  try {
    const bill_id = req.query.invoice;
    
    console.log('🔍 bill_id trouvé:', bill_id);
    
    if (bill_id) {
      const transaction = await Transaction.findOne({ ebill_id: bill_id });
      
      if (transaction) {
        console.log('✅ Transaction trouvée:', transaction.productId);
        console.log('📊 Statut actuel:', transaction.status);
        
        if (transaction.status === 'success') {
          res.redirect(`${FRONTEND_URL}/product/${transaction.productId}?payment=success`);
        } else if (transaction.status === 'pending') {
          res.redirect(`${FRONTEND_URL}/product/${transaction.productId}?payment=pending`);
        } else if (transaction.status === 'failed') {
          res.redirect(`${FRONTEND_URL}/product/${transaction.productId}?payment=failed`);
        } else {
          res.redirect(`${FRONTEND_URL}/product/${transaction.productId}?payment=unknown`);
        }
        return;
      } else {
        console.log('❌ Transaction non trouvée pour bill_id:', bill_id);
      }
    } else {
      console.log('⚠️ Aucun bill_id dans les query params');
    }
    
    res.redirect(`${FRONTEND_URL}/payment-result?status=error`);
    
  } catch (error) {
    console.error('❌ Erreur retour:', error);
    res.redirect(`${FRONTEND_URL}/payment-result?status=error`);
  }
});

router.get('/check-payment/:productId/:userEmail', async (req, res) => {
  try {
    const { productId, userEmail } = req.params;
    
    const transaction = await Transaction.findOne({
      productId: productId,
      userId: userEmail,
      status: 'success'
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

router.get('/transactions/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    
    const transactions = await Transaction.find({
      userId: userEmail
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      transactions: transactions
    });
  } catch (error) {
    console.error('❌ Erreur récupération transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/transaction-status/:ebillId', async (req, res) => {
  try {
    const { ebillId } = req.params;
    
    const transaction = await Transaction.findOne({
      ebill_id: ebillId
    });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction non trouvée'
      });
    }
    
    res.json({
      success: true,
      status: transaction.status,
      transaction: transaction
    });
  } catch (error) {
    console.error('❌ Erreur statut transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
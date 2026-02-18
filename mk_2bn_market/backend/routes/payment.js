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
  console.log('Route appelée');
  console.log('Body:', req.body);
  
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

    console.log('Envoi vers Ebilling:', payload);

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

    console.log('Réponse Ebilling:', response.data);

    if (response.data.e_bill && response.data.e_bill.bill_id) {
      const bill_id = response.data.e_bill.bill_id;
      console.log('E-bill créé:', bill_id);
      
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

      console.log('URL de paiement:', payment_url);
      
      res.json({
        success: true,
        payment_url: payment_url,
        ebill_id: bill_id
      });
    } else {
      throw new Error('Pas de bill_id dans la réponse');
    }

  } catch (error) {
    console.error('Erreur:', error.message);
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
  console.log('Callback Ebilling reçu:', req.body);
  
  try {
    const { state, billingid } = req.body;
    
    if (state === 'paid') {
      console.log('Paiement réussi !');
      
      const dbTransaction = await Transaction.findOne({ ebill_id: billingid });
      
      if (dbTransaction) {
        dbTransaction.status = 'completed';
        dbTransaction.paid_at = new Date();
        await dbTransaction.save();
        console.log('Transaction mise à jour:', dbTransaction._id);
      } else {
        console.log('Transaction non trouvée pour bill_id:', billingid);
      }
    } else {
      console.log('Paiement en attente, state:', state);
    }
    
    res.status(200).json({ status: 'received' });
  } catch (error) {
    console.error('Erreur callback:', error);
    res.status(200).json({ error: error.message });
  }
});

router.get('/return', async (req, res) => {
  console.log('Retour utilisateur'); 
  console.log('Query params:', req.query);
  console.log('Full URL:', req.url);
  
  try {
    const bill_id = req.query.invoice || req.query.bill_id || req.query.bill;
    
    console.log('bill_id trouvé:', bill_id);
    
    if (bill_id) {
      try {
        const billStatus = await axios.get(
          `https://lab.billing-easy.net/api/v1/merchant/e_bills/${bill_id}`,
          {
            headers: {
              'Authorization': getAuthHeader(),
              'Accept': 'application/json'
            }
          }
        );
        
        console.log('Statut de la facture:', billStatus.data);
        
        const transaction = await Transaction.findOne({ ebill_id: bill_id });
        
        if (transaction) {
          console.log('Transaction trouvée:', transaction.productId);
          
          if (billStatus.data.e_bill && billStatus.data.e_bill.state === 'paid') {
            transaction.status = 'completed';
            transaction.paid_at = new Date();
            await transaction.save();
            console.log('Transaction mise à jour via /return');
          }
          
          const paymentStatus = transaction.status === 'completed' ? 'success' : 'pending';
          res.redirect(`${FRONTEND_URL}/product/${transaction.productId}?payment=${paymentStatus}`);
          return;
        } else {
          console.log('Transaction non trouvée pour bill_id:', bill_id);
        }
      } catch (apiError) {
        console.error('Erreur lors de la vérification du statut:', apiError.message);
      }
    } else {
      console.log('Aucun bill_id dans les query params');
    }
    
    res.redirect(`${FRONTEND_URL}/payment-success?completed=true`);
    
  } catch (error) {
    console.error('Erreur retour:', error);
    res.redirect(`${FRONTEND_URL}/payment-success?error=true`);
  }
});

router.get('/check-payment/:productId/:userEmail', async (req, res) => {
  try {
    const { productId, userEmail } = req.params;
    
    const transaction = await Transaction.findOne({
      productId: productId,
      userId: userEmail,
      status: 'completed'
    });
    
    res.json({
      hasPaid: !!transaction && !transaction?.downloaded,
      downloaded: transaction?.downloaded || false
    });
  } catch (error) {
    console.error('Erreur vérification:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/mark-downloaded/:productId/:userEmail', async (req, res) => {
  try {
    const { productId, userEmail } = req.params;
    
    await Transaction.updateOne(
      { productId: productId, userId: userEmail, status: 'completed' },
      { downloaded: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur mark-downloaded:', error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
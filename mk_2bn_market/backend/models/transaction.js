const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: String, // Email ou identifiant unique de l'acheteur
  ebill_id: String,
  external_reference: String,
  amount: Number,
  payer_msisdn: String,
  payer_email: String,
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paid_at: Date
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
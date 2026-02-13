const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  ebill_id: {
    type: String,
    required: true,
    unique: true
  },
  external_reference: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  payer_msisdn: {
    type: String,
    required: true
  },
  payer_email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'processed', 'failed', 'cancelled'],
    default: 'processed'
  },
  paid_at: Date
}, { timestamps: true });

transactionSchema.index({ productId: 1, userId: 1 });
transactionSchema.index({ ebill_id: 1 });
transactionSchema.index({ status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
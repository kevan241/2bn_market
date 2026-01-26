const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  notice: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  categories: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true

  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
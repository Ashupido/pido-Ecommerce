const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,      // Product name
  price: Number,     // Product price
  description: String,
  category: { type: String, default: 'Uncategorized' },
  image: { type: String, default: '' },
});

module.exports = mongoose.model('Product', productSchema);
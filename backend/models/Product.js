const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,      // Product name
  price: Number,     // Product price
  description: String
});

module.exports = mongoose.model('Product', productSchema);
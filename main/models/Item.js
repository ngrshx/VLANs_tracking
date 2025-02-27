const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  model: { type: String, required: true },
  serialNumber: { type: String, required: true },
  type: { type: String, required: true }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
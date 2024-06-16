const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productsCollection = "Productos"

const productsSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true, maxlength: 50 },
  code: { type: String, required: true, unique: true },
  price:{ type: Number, required: true},
  status:{ type: Boolean, required: true, default: true },
  category:{ type: String, required: true },
  stock:{ type: Number, required: true },
  thumbnail:{ type: String},
  });

  productsSchema.plugin(mongoosePaginate);

  const productsModel = mongoose.model(productsCollection,productsSchema)

  module.exports = productsModel;

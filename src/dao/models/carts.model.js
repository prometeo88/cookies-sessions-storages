const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cartsCollection = "Carts"

const cartsSchema = new mongoose.Schema({
  products: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Productos" 
    },
    quantity: { type: Number, required: true }  
  }]
});

cartsSchema.plugin(mongoosePaginate);

  const cartsModel = mongoose.model(cartsCollection,cartsSchema)

  module.exports = cartsModel;

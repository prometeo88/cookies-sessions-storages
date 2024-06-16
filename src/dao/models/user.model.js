const mongoose = require('mongoose');

const userCollection = "Usuarios"

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true, maxlength: 50 },
    apellido: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true }
  });

  const userModel = mongoose.model(userCollection,userSchema)

  module.exports = userModel;

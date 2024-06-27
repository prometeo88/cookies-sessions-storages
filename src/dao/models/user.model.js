const mongoose = require("mongoose");
const { paginateSubDocs } = require("mongoose-paginate-v2");

const userCollection = "Usuarios";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxlength: 50 },
  last_name: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;

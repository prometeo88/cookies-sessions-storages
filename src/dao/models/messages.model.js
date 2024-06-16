const mongoose = require('mongoose');

const messagesCollection = "Messages"

const messagesSchema = new mongoose.Schema({
  user:{ type: String, required: true, max: 100},
  message:{type: String, required: true, max:250}
    
  });

  const messagesModel = mongoose.model(messagesCollection,messagesSchema)

  module.exports = messagesModel;

const express = require('express');
const messagesModel = require('../dao/models/messages.model.js');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await messagesModel.find();
    res.status(200).json({ result: "success", payload: messages });
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
});

module.exports = router;

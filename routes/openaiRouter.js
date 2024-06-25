const express = require('express');
const { generateResponse } = require('../controllers/rag.js');
const router = express.Router();

router.post('/stream', async (req, res) => {
  try {
    // Extract necessary data from request
    const { messages } = req.body;
    const userId = req.cognito.sub;
    // Call generateResponse function to handle response generation
    await generateResponse(res, userId, messages);

    // Response stream has been fully handled by generateResponse
    console.log('Response stream ended successfully.');
  } catch (error) {
      console.error('Error in /stream route:', error);
      res.status(500).send('Internal Server Error'); // Handle error response
  }
});

router.get('/me', async (req, res) => {
  res.json(req.cognito)
})

module.exports = router;
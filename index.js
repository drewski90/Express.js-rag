require('dotenv').config();
const express = require('express');
const openaiRouter = require('./routes/openaiRouter.js');
const { authenticate, authenticationError } = require('aws-cognito-express');

const app = express();

// Add the authentication middleware.
app.use(authenticate({
  region: process.env.COGNITO_REGION,
  userPoolId: process.env.COGNITO_USERPOOL_ID,
  tokenUse: ['id', 'access'],
  audience: [process.env.COGNITO_CLIENT_ID]
}));

// Middleware setup
app.use(express.json()); // Parse incoming requests with JSON payloads

// Router setup
app.use('/llm', openaiRouter);

app.use(authenticationError());

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

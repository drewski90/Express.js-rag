const { chatCompletion, getContextEmbeddings } = require('./openaiClient');
const { saveNewMessage } = require('./dynamodbClient');
const { upsertVectors, vectorQuery } = require('./pineconeClient');
const { v4: uuidv4 } = require('uuid');
const nunjucks = require('nunjucks');
const fs = require('fs');

nunjucks.configure({ autoescape: true });

// Load your template file
const contextInjectTemplate = fs.readFileSync('./templates/injectContext.html', 'utf8');

function injectContext(userMessage, documents) {
  // Render template to a string
  return nunjucks.renderString(
    contextInjectTemplate, 
    { userMessage, documents }
  );
}

async function makeVectorDoc(userMessage, assistantMessage) {
  // converts a dialog transaction into something we can stick in pinecone
  const context = `
    Query: ${userMessage}
    Answer: ${assistantMessage}
  `;
  // convert string to vector embedding
  const embeddingsResult = await getContextEmbeddings(context);
  // return a pineconedb compatible record
  return {
    id: uuidv4(),
    values: embeddingsResult[0],
    metadata: {
      source: 'chat',
      query: userMessage,
      response: assistantMessage,
      created: (new Date()).toISOString()
    }
  };
}

async function generateResponse(responseObject, userId, messages) {
  try {
    if (!messages) throw new Error('No messages array');
    let assistantResponse;
    // save last message
    const lastMessage = messages[messages.length - 1];
    await saveNewMessage(userId, lastMessage.role, lastMessage.content);
    // check if the last message is a prompt from the user
    const isUserPrompt = lastMessage.role === 'user';
    if (isUserPrompt) {
      // convert user query to a vector array
      const embeddingsResult = await getContextEmbeddings(lastMessage.content);
      // query pinecone for additional context
      const queryResults = await vectorQuery(userId, embeddingsResult[0]);
      // insert the content into the user's query
      const originalPrompt = lastMessage.content
      lastMessage.content = injectContext(lastMessage.content, queryResults);
      // start response 
      assistantResponse = await chatCompletion(messages);
      lastMessage.content = originalPrompt;
    } else {
      // start response 
      assistantResponse = await chatCompletion(messages);
    }
    // set response content to text
    responseObject.setHeader('Content-Type', 'text/plain');
    // iterate over assistant response chunks as they come in
    let responseText = ""; // accumulate response text
    for await (const part of assistantResponse) { // iterate over stream chunks
      const contentDelta = part.choices[0]?.delta?.content || '';
      responseObject.write(contentDelta); // write content to response
      responseText += contentDelta; // add content to final result
    }
    // end stream
    responseObject.end();
    // add assistant messages to messages array
    await saveNewMessage(userId, 'assistant', assistantResponse);
    // run a function to create a new pinecone record
    const doc = await makeVectorDoc(lastMessage.content, responseText);
    // save the new vector
    await upsertVectors(userId, [doc])
  } catch (e) {
    console.log(e);
    responseObject.end();
  }

}

module.exports = {
  generateResponse
};
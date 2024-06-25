const OpenAI = require('openai');
const pc = require('./pineconeClient');
const { completionOptions } = require('../llmConfig.js');

const openai = new OpenAI();

const chatCompletionsModelId = process.env.OPENAI_COMPLETIONS_MODEL_ID;
const embeddingsModelId = process.env.OPENAI_EMBEDDINGS_MODEL_ID;


async function chatCompletion(messages) {
  // Call chat completions
  try {

    return await openai.chat.completions.create({
      ...completionOptions,
      model: chatCompletionsModelId,
      messages,
      stream: true,
    });

  } catch (error) {
    console.error('Error streaming response:', error);
    throw new Error('Response streaming failed');
  }
}

async function getContextEmbeddings(text) {
  // generate embeddings for string or array of strings

  try {
    const response = await openai.embeddings.create({
      model: embeddingsModelId,
      input: text,
      encoding_format: "float",
    });
    return response.data.map(i => i.embedding)
  } catch (e) {
    console.error('Error generating embeddings:', error);
    throw new Error('Embeddings generation failed');
  }
}


module.exports =  {
  chatCompletion,
  getContextEmbeddings
}
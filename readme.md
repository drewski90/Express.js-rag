# Node.js Express App for Real-time AI-generated Responses (RAG)

This project is a Node.js Express application designed to provide real-time AI-generated text completions and embeddings using OpenAI's API. It features AWS Cognito for user authentication, DynamoDB for storing message history, and PineconeDB as a vector store for managing embeddings efficiently.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.x or later)
- npm (v6.x or later)
- AWS CLI configured with Administrator access
- Access to OpenAI API
- Access to Pinecone API

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/drewski90/Express.js-rag.git
cd Express.js-rag
```

2. **Setup Environmental Variables**
```
OPENAI_API_KEY=
OPENAI_EMBEDDINGS_MODEL_ID=
OPENAI_COMPLETIONS_MODEL_ID=
PINECONEDB_API_KEY=
PINECONEDB_INDEX_NAME=
COGNITO_REGION=
COGNITO_USERPOOL_ID=
COGNITO_CLIENT_ID=
DYNAMODB_TABLE_NAME=
DYNAMODB_REGION=
```
3. **Install dependencies**
```bash
npm install
```

4. **Run App**
```bash
node index.js
```

# Features

  1. User Authentication: Integrated with AWS Cognito to manage user authentication and secure access.
  2. AI Completions and Embeddings: Utilizes OpenAI's powerful models to generate text completions and embeddings.
  3. Message History: Stores all user interactions in AWS DynamoDB for persistence and analytics.
  4. Vector Storage: Uses PineconeDB to efficiently store and retrieve vector embeddings for advanced querying capabilities.
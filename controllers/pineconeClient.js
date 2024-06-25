const { Pinecone } = require('@pinecone-database/pinecone');

const apiKey = process.env.PINECONEDB_API_KEY;
const indexName = process.env.PINECONEDB_INDEX_NAME;

const pinecone = new Pinecone({ apiKey });
const index = pinecone.index(indexName);

async function vectorQuery(namespace, vector, filter=null, limit=5) {
    try {
      const params = {
        vector,
        topK:limit,
        includeValues:false,
        includeMetadata:true
      }
      if (filter) {
        params.filter = filter;
      }
      const results = await index.namespace(namespace).query(params);
      return results['matches'];
    } catch (error) {
      console.error('Error querying similar vectors:', error);
      return [];
    }
}

async function upsertVectors(namespace, vectors) {
  upsertResponse = await index
    .namespace(namespace)
    .upsert(vectors);
  return upsertResponse
}

module.exports = {
  upsertVectors,
  vectorQuery
}

const AWS = require('aws-sdk');
const { Converter } = AWS.DynamoDB;

// Configure AWS credentials and region
AWS.config.update({
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
    region: process.env['AWS_REGION'],
});

// Create DynamoDB document client
const dynamodb = new AWS.DynamoDB.DocumentClient({ 
  region: process.env.DYNAMODB_REGION
});
const tableName = process.env.DYNAMODB_TABLE_NAME

async function saveNewMessage(userId, role, content) {
  const params = {
    TableName: tableName,
    Item: {
      pk: `USER#${userId}#MSGS`,
      sk: (new Date()).toISOString(),
      role,
      content
    },
  };
  try {
    return await dynamodb.put(params).promise();
  } catch (error) {
    console.error('Error new saving message:', error);
    throw error; // Propagate error to caller
  }
}

module.exports = { 
  saveNewMessage
};
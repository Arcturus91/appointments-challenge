const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    console.log("consultation event", event);
    const path = event.path;
    const method = event.httpMethod;
    console.log(path, method);

    const command = new ScanCommand({
      TableName: "Appointments",
    });

    const response = await ddbDocClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Appointments retrieved successfully",
        appointments: response.Items,
      }),
    };
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

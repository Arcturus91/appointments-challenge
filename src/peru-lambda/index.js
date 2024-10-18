const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const processMessageAsync = async (record, context) => {
  const appointmentData = JSON.parse(record.body);
  console.log("Appointment Data:", appointmentData);
  console.log("Processing appointment:", appointmentData.appointmentId);

  const item = {
    appointment_id: appointmentData.appointmentId,
    country: appointmentData.country,
    status: appointmentData.status,
  };

  const command = new PutCommand({
    TableName: "Appointments",
    Item: item,
  });

  await ddbDocClient.send(command);
  console.log(`Appointment ${appointmentData.appointmentId} saved to DynamoDB`);
};

exports.handler = async (event, context) => {
  console.log("Event:", JSON.stringify(event, null, 2));

  const batchItemFailures = [];

  for (const record of event.Records) {
    try {
      await processMessageAsync(record, context);
    } catch (error) {
      console.error("Error processing appointment:", error);
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  console.log("Batch Item Failures:", batchItemFailures);
  return { batchItemFailures };
};

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const updateAppointmentStatus = async (appointmentData) => {
  console.log("Appointment Data:", appointmentData);
  console.log(
    "Updating status for appointment:",
    appointmentData.appointmentId
  );

  const command = new UpdateCommand({
    TableName: "Appointments",
    Key: {
      appointment_id: appointmentData.appointmentId,
    },
    UpdateExpression: "SET #status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": appointmentData.status,
    },
    ReturnValues: "UPDATED_NEW",
  });

  const result = await ddbDocClient.send(command);
  console.log(
    `Appointment ${appointmentData.appointmentId} status updated in DynamoDB`
  );
  console.log("Updated values:", result.Attributes);
  return result.Attributes;
};

export const handler = async (event, context) => {
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    const eventBody = JSON.parse(event.body);
    const result = await updateAppointmentStatus(eventBody);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating appointment status" }),
    };
  }
};

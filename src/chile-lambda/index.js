exports.handler = async (event) => {
  try {
    console.log("event chile", event);

    for (const record of event.Records) {
      const appointmentData = JSON.parse(record.body);

      console.log("Appointment Data:", appointmentData);

      console.log("Processing appointment:", appointmentData.appointmentId);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Appointments processed successfully" }),
    };
  } catch (error) {
    console.error("Error processing appointments:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

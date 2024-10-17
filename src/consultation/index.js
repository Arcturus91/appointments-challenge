exports.handler = async (event) => {
  try {
    console.log("consultation event", event);
    const path = event.path;
    const method = event.httpMethod;
    const body = JSON.parse(event.body);
    console.log(path, method, body);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from consultation" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

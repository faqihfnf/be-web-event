import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "API Documentation",
    description: "API Documentation",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "https://be-web-event.vercel.app/api",
      description: "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "faqih1993",
        password: "1234",
      },
      RegisterRequest: {
        fullName: "penyok osas",
        username: "penyok123",
        email: "penyok@yopmail.com",
        password: "Penyok123",
        confirmPassword: "Penyok123",
      },
      ActivationRequest: {
        code: "1234",
      },
    },
  },
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);

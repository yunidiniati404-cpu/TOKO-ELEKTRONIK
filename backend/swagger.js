const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Toko Elektronik Online API",
      version: "1.0.0",
      description: "API Documentation untuk Toko Elektronik Online dengan Database MySQL",
      contact: {
        name: "API Support",
        email: "support@tokoelektronik.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
      {
        url: "http://localhost:3000",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Token dari login endpoint",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: "admin" },
            email: { type: "string", example: "admin@tokoelektronik.com" },
            phone: { type: "string", example: "+62812345678" },
            address: { type: "string", example: "Jl. Buku No. 123" },
            profilePhoto: { type: "string", example: "data:image/jpeg;base64,..." },
            role: { type: "string", enum: ["user", "admin"], example: "admin" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Clean Code" },
            author: { type: "string", example: "Robert C. Martin" },
            price: { type: "number", format: "decimal", example: 189000 },
            category: { type: "string", example: "programming" },
            image: { type: "string", example: "https://..." },
            rating: { type: "number", format: "decimal", example: 4.8 },
            reviews: { type: "integer", example: 45 },
            discount: { type: "integer", example: 15 },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            order_number: { type: "string", example: "ORD-1706868000000" },
            user_id: { type: "integer", example: 1 },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  title: { type: "string" },
                  image: { type: "string" },
                  quantity: { type: "integer" },
                  price: { type: "number" },
                },
              },
            },
            total: { type: "number", format: "decimal", example: 440000 },
            status: { type: "string", example: "Dalam Pengiriman" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Error message" },
          },
        },
      },
    },
  },
  apis: ["./server.js"],
};

module.exports = swaggerJsdoc(options);

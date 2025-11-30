import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fullstack Webshop API',
      version: '1.0.0',
      description: 'API documentation for the Fullstack Webshop backend',
    },
    servers: [
      { url: 'http://localhost:5000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            imageUrl: { type: 'string' },
            stock: { type: 'number' },
            isFeatured: { type: 'boolean' },
          },
        },
        User: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
          },
        },
        Category: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            quantity: { type: 'integer' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' },
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'integer' },
                  priceAtPurchase: { type: 'number' },
                },
              },
            },
            totalAmount: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'paid', 'shipped', 'cancelled'] },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJSDoc(options);
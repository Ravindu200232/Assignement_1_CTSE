import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { connectToDatabase } from './DbConnection.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import paymentRouter from './routes/paymentRoute.js';

dotenv.config();

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  hsts: false,
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(bodyParser.json());

app.use((req, res, next) => {
  let token = req.header('Authorization');
  if (token != null) {
    token = token.replace('Bearer ', '');
    jwt.verify(token, process.env.SEKRET_KEY, (err, decode) => {
      if (!err) req.user = decode;
    });
  }
  next();
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment Service API',
      version: '1.0.0',
      description: 'Payment Service for Food Ordering App',
    },
    servers: [{ url: '/' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./routes/*.js'],
};

app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  swaggerOptions.definition.servers = [{ url: `${protocol}://${host}` }];
  const dynamicSpec = swaggerJsdoc(swaggerOptions);
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

app.get('/api-docs.json', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  swaggerOptions.definition.servers = [{ url: `${protocol}://${host}` }];
  res.json(swaggerJsdoc(swaggerOptions));
});

connectToDatabase();

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'payment-service', timestamp: new Date().toISOString() });
});

app.use('/api/payment', paymentRouter);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
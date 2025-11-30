import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import healthRouter from './routes/health.js';
import productsRouter from './routes/products.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import ordersRouter from './routes/orders.js';
import categoriesRouter from './routes/categories.js';
import cartRouter from './routes/cart.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

connectDB();

app.use('/healthcheck', healthRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;

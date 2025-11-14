import express, { Application } from 'express';
import cors from 'cors';
import config from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { requestLogger } from './middleware/logger.middleware';
import { rateLimiter } from './middleware/rateLimiter.middleware';

export function createApp(): Application {
  const app = express();

  // CORS
  app.use(
    cors({
      origin: config.server.corsOrigin,
      credentials: true,
    })
  );

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use(requestLogger);

  // Rate limiting
  app.use('/api/', rateLimiter);

  // API routes
  app.use('/api', routes);

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'Parallel Self Simulator API',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        profile: '/api/profile',
        events: '/api/events',
        stats: '/api/stats',
      },
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

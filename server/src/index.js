import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { config, requireConfig } from './config.js';
import { connectDb } from './db.js';
import { errorHandler, notFound } from './middleware/error.js';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { issuesRouter } from './routes/issues.js';
import { uploadsRouter } from './routes/uploads.js';
import { notificationsRouter } from './routes/notifications.js';
import { dashboardRouter } from './routes/dashboard.js';
import { activityRouter } from './routes/activity.js';
import { rewardsRouter } from './routes/rewards.js';

async function bootstrap() {
  requireConfig();
  await connectDb();

  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.clientOrigin,
      credentials: false,
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(morgan('dev'));

  app.use(healthRouter);

  app.use('/api/auth', authRouter);
  app.use('/api/issues', issuesRouter);
  app.use('/api/uploads', uploadsRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/activity', activityRouter);
  app.use('/api/rewards', rewardsRouter);

  app.use(notFound);
  app.use(errorHandler);

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});

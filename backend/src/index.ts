import 'dotenv/config';
import { app } from './app.js';
import { cleanupInterruptedJobs } from './jobs.js';

const PORT = parseInt(process.env.PORT || '8000', 10);

async function startServer() {
  // Mark any stuck jobs as failed on startup
  await cleanupInterruptedJobs();

  app.listen(PORT, () => {
    console.log(`[whatcleothinks API] Running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Fatal Startup Error]', err?.message || 'Failed to start server');
  process.exit(1);
});

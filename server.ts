import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import applicationRoutes from './src/backend/routes/applicationRoutes';
import { errorHandler } from './src/backend/middleware/errorHandler';
import { pool, initializeDatabase } from './src/backend/config/db';

async function seedDataIfNeeded() {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM applications');
    const count = parseInt(result.rows[0].count, 10);
    
    if (count === 0) {
      console.log('No applications found. Seeding dummy entries for professional review...');
      const sampleData = [
        {
          company_name: 'Google',
          job_title: 'Software Engineering Intern',
          job_type: 'INTERNSHIP',
          status: 'INTERVIEWING',
          applied_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          notes: 'Had a great first phone screen. Next steps are 2x 45-min technical interviews focusing on DSA.',
        },
        {
          company_name: 'Apple',
          job_title: 'UI/UX Engineer Co-op',
          job_type: 'INTERNSHIP',
          status: 'APPLIED',
          applied_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          notes: 'Applied on university career board with referral from alumni. Resume matches requirements perfectly.',
        },
        {
          company_name: 'Stripe',
          job_title: 'Frontend Engineer',
          job_type: 'FULL_TIME',
          status: 'OFFER',
          applied_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          notes: 'Offer letter received! Great compensation package. Discussing stock options and official start date.',
        },
        {
          company_name: 'Netflix',
          job_title: 'Software Engineer',
          job_type: 'FULL_TIME',
          status: 'REJECTED',
          applied_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          notes: 'Made it to final round but rejected in favor of someone with slightly more specialized cloud microservices experience. Keep moving forward!',
        },
      ];

      for (const data of sampleData) {
        await pool.query(
          `INSERT INTO applications (company_name, job_title, job_type, status, applied_date, notes)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [data.company_name, data.job_title, data.job_type, data.status, data.applied_date, data.notes]
        );
      }
      console.log('Successfully pre-seeded 4 sample job applications.');
    }
  } catch (error) {
    console.error('Did not seed application database: ', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 5005;

  // Initialize database schema
  await initializeDatabase();

  // JSON request parser
  app.use(express.json());

  // API router endpoints
  app.use('/api/applications', applicationRoutes);

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
  });

  // Global Error Handling
  app.use(errorHandler);

  // Seed data if database is empty
  await seedDataIfNeeded();

  // Integrates Vite middleware in development or custom server static rendering in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
}

startServer();

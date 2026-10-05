import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database successfully.');
  } catch (err: any) {
    console.warn('⚠️ PostgreSQL Connection Notice:', err.message || err);
    console.warn('➡️ Make sure to set a valid DATABASE_URL in backend/.env for PostgreSQL persistence.');
  }
}

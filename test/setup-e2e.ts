import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';

const prisma = new PrismaClient();

function generateDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('please provide a DATABASE_URL');
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});

import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // const result = await prisma.test.createMany({
  //   data: [
  //     { value: 'test1', test: 1 },
  //     { value: 'test2', test: 2 },
  //   ],
  // });
  // console.log(result);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();
    await pool.end();

    process.exit(1);
  });

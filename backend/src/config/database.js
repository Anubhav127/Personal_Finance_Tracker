import Pool from 'pg-pool';
import dotenv from 'dotenv';

dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
});

console.log(pool);

// Test database connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (error) => {
  console.error('Unexpected database error:', error);
  process.exit(-1);
});

export default pool;
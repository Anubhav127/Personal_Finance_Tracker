import dotenv from 'dotenv';
import fs from 'fs';
import pool from '../config/database.js';
import bcrypt from 'bcrypt';

dotenv.config();

//setting up the database schema
const runMigration = async () => {
    const client = await pool.connect();

    try {
        console.log('Starting database migration...');

        const schemaSql = fs.readFileSync("./schema.sql", "utf-8");
        //console.log(schemaSql);

        await client.query(schemaSql);
        console.log('Database schema created successfully.');

        return true;
    } catch (error) {
        console.error('Error during database migration:', error);
        throw error;
    } finally {
        client.release();
    }
}

//seeding initial data
const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');
    
    // Insert default categories
    const categories = [
      { name: 'Salary', type: 'income' },
      { name: 'Investment', type: 'income' },
      { name: 'Food', type: 'expense' },
      { name: 'Transport', type: 'expense' },
      { name: 'Shopping', type: 'expense' },
      { name: 'Bills', type: 'expense' },
      { name: 'Other', type: 'both' }
    ];
    
    for (const category of categories) {
      await client.query(
        'INSERT INTO categories (name, type) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [category.name, category.type]
      );
    }
    console.log('Categories seeded successfully');
    
    // Create demo users with properly hashed passwords
    const demoPassword = 'password123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(demoPassword, saltRounds);
    
    const demoUsers = [
      { email: 'admin@test.com', username: 'Admin User', role: 'admin' },
      { email: 'user@test.com', username: 'Regular User', role: 'user' },
      { email: 'readonly@test.com', username: 'Read Only User', role: 'read-only' }
    ];
    
    for (const user of demoUsers) {
      await client.query(
        'INSERT INTO users (email, username, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
        [user.email, user.username, passwordHash, user.role]
      );
    }
    console.log('Demo users created successfully');
    console.log('\n Demo user credentials:');
    console.log('  Admin: admin@test.com / password123');
    console.log('  User: user@test.com / password123');
    console.log('  Read-only: readonly@test.com / password123');
    
    return true;
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    //await runMigration();
    await seedDatabase();
    console.log('\n✓ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Database setup failed:', error);
    process.exit(1);
  }
}

main();
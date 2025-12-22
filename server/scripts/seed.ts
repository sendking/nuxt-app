import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs/promises';
import path from 'path';

// --- Configuration ---
const changelogsDir = path.resolve(process.cwd(), 'changelogs');
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

async function seed() {
  // For cloud databases like Vercel Postgres, SSL is required.
  const isProduction = /vercel\.app/.test(databaseUrl);
  
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });

  console.log('Connecting to database...');
  
  try {
    const client = await pool.connect();
    console.log(`Database connected. (SSL: ${isProduction})`);

    // Check if the original changelogs directory exists
    try {
      await fs.access(changelogsDir);
    } catch (e) {
      console.log('The "changelogs" directory with markdown files does not exist. No local files to seed.');
      console.log('If your production database is empty, you may need to restore these files to run the seed.');
      return;
    }

    const files = await fs.readdir(changelogsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    if (markdownFiles.length === 0) {
      console.log('No markdown files found in the changelogs directory. Nothing to seed.');
      return;
    }

    console.log(`Found ${markdownFiles.length} changelog files to seed.`);

    await client.query('BEGIN');

    for (const file of markdownFiles) {
      const slug = path.basename(file, '.md');
      const filePath = path.join(changelogsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');

      const upsertQuery = `
        INSERT INTO changelogs (slug, content)
        VALUES ($1, $2)
        ON CONFLICT (slug)
        DO UPDATE SET content = $2, updated_at = CURRENT_TIMESTAMP;
      `;
      
      await client.query(upsertQuery, [slug, content]);
      console.log(`- Seeded changelog with slug: ${slug}`);
    }

    await client.query('COMMIT');
    console.log('Seeding completed successfully!');
    
    client.release();
  } catch (error) {
    console.error('Error during seeding process:', error);
    await pool.query('ROLLBACK');
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
}

seed();

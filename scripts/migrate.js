#!/usr/bin/env node
// Usage: SUPABASE_DB_PASSWORD=yourpassword node scripts/migrate.js
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const password = process.env.SUPABASE_DB_PASSWORD
if (!password) {
  console.error('Error: Set SUPABASE_DB_PASSWORD env var before running.')
  console.error('  SUPABASE_DB_PASSWORD=yourpassword node scripts/migrate.js')
  process.exit(1)
}

const host = process.env.SUPABASE_DB_HOST || 'db.yoauzfwspuljgvbuevbw.supabase.co'

const client = new Client({
  host,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password,
  ssl: { rejectUnauthorized: false },
})

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/001_schema.sql'), 'utf8')
  console.log(`Connecting to ${host}…`)
  await client.connect()
  console.log('Running migration…')
  await client.query(sql)
  await client.end()
  console.log('✓ Migration complete — all tables and RLS policies created.')
}

run().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})

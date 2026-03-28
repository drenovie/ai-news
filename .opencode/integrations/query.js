#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(url, key)

const sql = process.argv[2] || process.argv.slice(2).join(' ')

if (!sql) {
  console.error('Usage: node query.js "SQL STATEMENT"')
  process.exit(1)
}

async function run() {
  const { data, error } = await supabase.rpc('exec_sql', { sql })
  if (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
  console.log(JSON.stringify(data, null, 2))
}

run().catch(e => { console.error(e); process.exit(1) })

#!/usr/bin/env node
// Usage: node query-readonly.js "SELECT * FROM videos ORDER BY published_at DESC LIMIT 5"
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(url, key)

const command = process.argv.slice(2).join(' ').trim()
if (!command) {
  console.error('Usage: node query-readonly.js "SELECT * FROM videos LIMIT 5"')
  process.exit(1)
}

// Very simple parser: supports "SELECT * FROM table [WHERE ...] [LIMIT n]"
const match = command.match(/^SELECT\s+\*\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/i)
if (!match) {
  console.error('Only simple SELECT queries supported: SELECT * FROM table [WHERE cond] [ORDER BY col] [LIMIT n]')
  process.exit(1)
}

const [, table, where, orderBy, limit] = match
let query = supabase.from(table).select('*')
if (where) {
  // Very basic parsing: column = value or column > value, etc.
  const [col, op, val] = where.split(/\s+/)
  if (op === '=') query = query.eq(col, val.replace(/^['"]|['"]$/g, ''))
  else if (op === '>') query = query.gt(col, val)
  else if (op === '<') query = query.lt(col, val)
  else console.warn('Where operator not fully supported, ignored:', where)
}
if (orderBy) {
  const [col, dir] = orderBy.split(/\s+/)
  query = query.orderBy(col, dir === 'DESC' ? 'desc' : 'asc')
}
if (limit) query = query.limit(parseInt(limit))
else query = query.limit(10)

async function run() {
  const { data, error } = await query
  if (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
  console.log(JSON.stringify(data, null, 2))
}

run().catch(e => { console.error(e); process.exit(1) })

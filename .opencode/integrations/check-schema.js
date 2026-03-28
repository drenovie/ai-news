#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

async function check() {
  const [{ data: videos }, { data: news }] = await Promise.all([
    supabase.from('videos').select('*', { count: 'exact', head: true }),
    supabase.from('news_items').select('*', { count: 'exact', head: true }),
  ])

  console.log('Schema check:')
  console.log('  videos table exists:', videos !== null)
  console.log('  news_items table exists:', news !== null)
  console.log('  Videos count:', videos?.count || 0)
  console.log('  News items count:', news?.count || 0)
}

check().catch(e => { console.error(e); process.exit(1) })

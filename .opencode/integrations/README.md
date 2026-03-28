# AI News — Supabase Integration for OpenCode

Set these environment variables in OpenCode Web before using commands:

- `SUPABASE_URL` — Your Supabase project URL (e.g., `https://xyz.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (full read/write access)

Then run the commands:

```bash
# Check if tables exist and count items
opencode run check-schema

# Show latest videos
opencode run videos

# Show latest news items
opencode run news
```

For custom queries, edit the commands in `.opencode/integrations/supabase.json` or add your own scripts.

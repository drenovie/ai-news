

## Add Top 5 Club Badges to Homepage

### Overview
Add a horizontal row of the top 5 Serie A clubs (by league standings position) below the header, plus a "See all" link to `/clubs`. Tapping a badge filters content; tapping again clears it.

### Steps

**1. Create `ClubQuickFilter` component** (`src/components/ClubQuickFilter.tsx`)
- Query `league_standings` (already cached) to get top 5 by position
- Map each standing's `club_id` to a club via `useClubsContext`
- Render as a horizontal row of `ClubBadge` components + a "See all →" link to `/clubs`
- Props: `activeClubId: string | null`, `onSelect: (id: string | null) => void`
- Clicking selected badge deselects (clears filter)

**2. Integrate into `Index.tsx`**
- Place `<ClubQuickFilter />` at the top of `<main>`, before the existing club filter banner
- Wire to existing `clubFilter` state and URL param logic
- Hide the verbose club filter banner when quick-filter is shown (the selected badge already indicates active filter)

### No database or migration changes needed — uses existing `league_standings` and `clubs` data.


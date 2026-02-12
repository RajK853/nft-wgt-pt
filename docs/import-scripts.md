# Import Scripts Documentation

This document describes the data import scripts in the `scripts/` directory.

## Overview

The import scripts follow **SOLID** and **KISS** principles:
- **S**ingle Responsibility: Each service handles one concern
- **O**pen/Closed: Easy to add new data sources
- **L**iskov Substitution: Services implement common interfaces
- **I**nterface Segregation: Small, focused methods
- **D**ependency Inversion: Main depends on abstractions

## Architecture

```
scripts/
├── config/
│   └── index.js          # All configuration (KISS - one place)
├── services/
│   ├── googleSheets.js   # Google Sheets API service
│   └── supabase.js       # Database operations
└── import-game-events.js  # Main: Google Sheets API → game_events
```

## Scripts

### Import from Google Sheets API

Uses the Google Sheets API with service account authentication.

```bash
npm run import:sheets
# or
bun run scripts/import-game-events.js
```

**Flow:**
1. Fetch data from Google Sheets API
2. Transform to game_events format
3. Sync to Supabase (clear + insert)

## Configuration

All configuration is centralized in `scripts/config/index.js`:

```javascript
// Supabase
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

// Google Sheets API
google-credentials.json (in project root)
```

## Database Tables

### game_events
- `id` (UUID, primary key)
- `row_order` (INT) - preserves order from sheet
- `date` (TIMESTAMP)
- `player_name` (TEXT)
- `keeper_name` (TEXT)
- `status` (TEXT)
- `created_at` (TIMESTAMP)

## Sync Behavior

The script performs a **full sync**:
1. Delete all existing records
2. Insert fresh data from source

This ensures the database exactly matches the source data.

## Troubleshooting

### Google Sheets API
- Ensure Google Sheets API is enabled in Google Cloud Console
- Verify the sheet is shared with the service account email
- Check service account has proper permissions

### Supabase Connection
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Check network connectivity to Supabase
- Ensure tables exist in the database

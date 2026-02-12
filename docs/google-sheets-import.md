# Google Sheets Import

This document describes how to import penalty data from Google Sheets into Supabase.

## Source Data

- **Google Sheet**: [NFT Weingarten Penalty Database](https://docs.google.com/spreadsheets/d/1ehIA2Ea_8wCMy5ICmwFl14FZUPLA8ki6VQBLcGqsVUU/)
- **Sheet Name**: Male
- **Data Range**: Columns A-F (Date, Shooter Name, Keeper Name, Status, Remark)

## Data Schema Mapping

| Google Sheet Column | Supabase `game_events` Column | Type |
|---------------------|------------------------------|------|
| Date | date | timestamp |
| Shooter Name | player_name | text |
| Keeper Name | keeper_name | text |
| Status | status | text |

### Status Values
- `goal` - Shot was a goal
- `saved` - Shot was saved by keeper
- `out` - Shot went out

## Google Sheets API Setup

To enable automated imports, follow these steps:

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: `nft-weingarten-import`

### 2. Enable Sheets API
1. Navigate to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click **Enable**

### 3. Create Service Account
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Configure:
   - Service account name: `sheets-import`
   - Service account ID: `sheets-import`
   - Role: **Project** → **Viewer**
4. Click **Done**

### 4. Create Service Account Key
1. Click on the `sheets-import` service account
2. Go to **Keys** → **Add Key** → **Create new key**
3. Select **JSON** format
4. Download the file
5. Save it as `google-credentials.json` in the project root

### 5. Share Google Sheet
1. Open the [Google Sheet](https://docs.google.com/spreadsheets/d/1ehIA2Ea_8wCMy5ICmwFl14FZUPLA8ki6VQBLcGqsVUU/)
2. Click **Share**
3. Add the service account email (found in your JSON file as `client_email`)
4. Set permission to **Editor**

### 6. Install Dependencies
```bash
npm install @googleapis/sheets
```

### 7. Run Import
```bash
npm run import
```

## Manual Import (Alternative)

If you prefer not to set up the API:

1. Export Google Sheet as CSV
2. Use Supabase Dashboard:
   - Go to Table Editor
   - Select `game_events` table
   - Click **Import data**
   - Upload CSV file

## Environment Variables

Ensure these are set in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

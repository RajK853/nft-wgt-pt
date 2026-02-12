/**
 * Import Game Events Script
 * 
 * Main orchestrator for importing data from Google Sheets API to game_events table.
 * Following KISS principle - simple, readable flow.
 * 
 * Usage: bun run scripts/import-game-events.js
 */

import { GoogleSheetsService } from './services/googleSheets.js'
import { SupabaseService } from './services/supabase.js'

/**
 * Main import function
 * Simple orchestration flow:
 * 1. Fetch from source
 * 2. Transform
 * 3. Sync to database
 */
async function main() {
  console.log('='.repeat(50))
  console.log('Google Sheets API → Supabase (game_events)')
  console.log('='.repeat(50))
  console.log('')

  try {
    // Step 1: Fetch data from Google Sheets
    console.log('Step 1: Fetching data from Google Sheets...')
    const googleSheets = new GoogleSheetsService()
    const rawData = await googleSheets.fetchData()
    console.log(`  ✓ Fetched ${rawData.length} rows`)

    // Step 2: Transform data
    console.log('Step 2: Transforming data...')
    const events = googleSheets.transformToGameEvents(rawData)
    console.log(`  ✓ Transformed ${events.length} valid records`)

    // Step 3: Sync to database
    console.log('Step 3: Syncing to database...')
    const supabase = new SupabaseService()
    const count = await supabase.syncGameEvents(events)
    console.log(`  ✓ Synced ${count} records`)

    console.log('')
    console.log('✅ Import completed successfully!')
    console.log('   Database now matches Google Sheet exactly.')

  } catch (error) {
    console.error('')
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

main()

import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import fetch from 'node-fetch';

const sheetUrl = 'https://docs.google.com/spreadsheets/d/1ehIA2Ea_8wCMy5ICmwFl14FZUPLA8ki6VQBLcGqsVUU/export?format=csv';

// Note: This script requires the SUPABASE_SERVICE_ROLE_KEY to be set in your environment.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runImport() {
  console.log('Starting data import...');

  // 1. Fetch CSV data from Google Sheet
  console.log('Fetching data from Google Sheet...');
  const response = await fetch(sheetUrl);
  const csvText = await response.text();
  const { data: parsedData } = Papa.parse(csvText, { header: true });

  const records = parsedData.filter(row => row['Date'] && row['Shooter Name'] && row['Keeper Name'] && row['Status']);
  console.log(`Found ${records.length} valid records in the sheet.`);

  // 2. Clear existing data
  console.log('Clearing existing data from tables...');
  const { error: truncatePenaltiesError } = await supabase.from('penalties').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (truncatePenaltiesError) {
    console.error('Error clearing penalties table:', truncatePenaltiesError.message);
    return;
  }
  const { error: truncatePlayersError } = await supabase.from('players').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (truncatePlayersError) {
    console.error('Error clearing players table:', truncatePlayersError.message);
    return;
  }

  // 3. Get unique players and insert them
  console.log('Finding and inserting unique players...');
  const playerNames = new Set();
  records.forEach(row => {
    if (row['Shooter Name']) playerNames.add(row['Shooter Name'].trim());
    if (row['Keeper Name']) playerNames.add(row['Keeper Name'].trim());
  });

  const playersToInsert = Array.from(playerNames).map(name => ({ name }));
  const { error: insertPlayersError } = await supabase.from('players').insert(playersToInsert, { onConflict: 'name' });

  if (insertPlayersError) {
    console.error('Error inserting players:', insertPlayersError.message);
    return;
  }
  console.log(`Inserted or found ${playersToInsert.length} unique players.`);

  // 4. Fetch all players to create a name-to-ID map
  console.log('Fetching player IDs...');
  const { data: players, error: fetchPlayersError } = await supabase.from('players').select('id, name');
  if (fetchPlayersError) {
    console.error('Error fetching players:', fetchPlayersError.message);
    return;
  }
  const playerMap = new Map(players.map(p => [p.name, p.id]));

  // 5. Prepare and insert penalty records
  console.log('Preparing and inserting penalty records...');
  const penaltiesToInsert = records.map(row => {
    const shooterId = playerMap.get(row['Shooter Name'].trim());
    const keeperId = playerMap.get(row['Keeper Name'].trim());
    const status = row['Status']?.toLowerCase().trim();

    if (!shooterId || !keeperId || !['goal', 'out', 'saved'].includes(status)) {
        console.warn(`Skipping invalid row:`, row);
        return null;
    }

    return {
      date: new Date(row['Date']).toISOString(),
      shooter_id: shooterId,
      keeper_id: keeperId,
      status: status,
      remark: row['Remark'] || null,
    };
  }).filter(Boolean);

  const { error: insertPenaltiesError } = await supabase.from('penalties').insert(penaltiesToInsert);

  if (insertPenaltiesError) {
    console.error('Error inserting penalties:', insertPenaltiesError.message);
    return;
  }

  console.log(`Successfully inserted ${penaltiesToInsert.length} penalty records.`);
  console.log('Data import finished.');
}

runImport();

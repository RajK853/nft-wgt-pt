/**
 * Supabase Service
 * 
 * Handles all Supabase database operations.
 * Following Single Responsibility Principle - only handles database operations.
 */

import { supabaseConfig, tables } from '../config/index.js'

/**
 * Custom error classes for better error handling
 */
export class DatabaseError extends Error {
  constructor(message, originalError = null) {
    super(message)
    this.name = 'DatabaseError'
    this.originalError = originalError
  }
}

export class TableNotFoundError extends Error {
  constructor(tableName) {
    super(`Table '${tableName}' not found`)
    this.name = 'TableNotFoundError'
    this.tableName = tableName
  }
}

/**
 * Supabase Service class
 * Encapsulates all database operations
 */
export class SupabaseService {
  constructor(config = supabaseConfig) {
    this.config = config
    this.client = config.client
  }

  /**
   * Check if a table exists
   * @param {string} tableName - Name of the table
   * @returns {Promise<boolean>}
   */
  async tableExists(tableName) {
    const { error } = await this.client
      .from(tableName)
      .select('id')
      .limit(1)
    
    return !error
  }

  /**
   * Delete all records from a table
   * @param {string} tableName - Name of the table
   * @returns {Promise<void>}
   */
  async clearTable(tableName) {
    const { error } = await this.client
      .from(tableName)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (error) {
      throw new DatabaseError(`Failed to clear table '${tableName}'`, error)
    }
  }

  /**
   * Insert records into a table
   * @param {string} tableName - Name of the table
   * @param {Array<Object>} records - Records to insert
   * @returns {Promise<Array<Object>>} - Inserted records
   */
  async insert(tableName, records) {
    const { data, error } = await this.client
      .from(tableName)
      .insert(records)
      .select()

    if (error) {
      throw new DatabaseError(`Failed to insert into '${tableName}'`, error)
    }

    return data
  }

  /**
   * Upsert records into a table
   * @param {string} tableName - Name of the table
   * @param {Array<Object>} records - Records to upsert
   * @param {string} conflictColumn - Column to check for conflicts
   * @returns {Promise<Array<Object>>} - Upserted records
   */
  async upsert(tableName, records, conflictColumn) {
    const { data, error } = await this.client
      .from(tableName)
      .upsert(records, { onConflict: conflictColumn })
      .select()

    if (error) {
      throw new DatabaseError(`Failed to upsert into '${tableName}'`, error)
    }

    return data
  }

  /**
   * Fetch all records from a table
   * @param {string} tableName - Name of the table
   * @param {string} selectColumns - Columns to select (default: '*')
   * @returns {Promise<Array<Object>>}
   */
  async fetchAll(tableName, selectColumns = '*') {
    const { data, error } = await this.client
      .from(tableName)
      .select(selectColumns)

    if (error) {
      throw new DatabaseError(`Failed to fetch from '${tableName}'`, error)
    }

    return data
  }

  /**
   * Sync game events - clear and insert fresh data
   * @param {Array<Object>} events - Game events to insert
   * @returns {Promise<number>} - Number of records inserted
   */
  async syncGameEvents(events) {
    console.log(`Syncing ${events.length} game events...`)
    
    await this.clearTable(tables.gameEvents)
    const inserted = await this.insert(tables.gameEvents, events)
    
    return inserted.length
  }

  /**
   * Sync players and penalties - clear and insert fresh data
   * @param {Array<Object>} records - Raw records from CSV
   * @returns {Promise<{players: number, penalties: number}>}
   */
  async syncPenalties(records) {
    console.log('Syncing penalty data...')
    
    // Extract unique player names
    const playerNames = new Set()
    records.forEach(row => {
      if (row['Shooter Name']) playerNames.add(row['Shooter Name'].trim())
      if (row['Keeper Name']) playerNames.add(row['Keeper Name'].trim())
    })

    // Clear and insert players
    await this.clearTable(tables.players)
    const playersToInsert = Array.from(playerNames).map(name => ({ name }))
    await this.upsert(tables.players, playersToInsert, 'name')

    // Fetch player IDs
    const players = await this.fetchAll(tables.players, 'id, name')
    const playerMap = new Map(players.map(p => [p.name, p.id]))

    // Prepare and insert penalties
    const penaltiesToInsert = records
      .map(row => {
        const shooterId = playerMap.get(row['Shooter Name']?.trim())
        const keeperId = playerMap.get(row['Keeper Name']?.trim())
        const status = row['Status']?.toLowerCase().trim()

        if (!shooterId || !keeperId || !['goal', 'out', 'saved'].includes(status)) {
          return null
        }

        return {
          date: new Date(row['Date']).toISOString(),
          shooter_id: shooterId,
          keeper_id: keeperId,
          status: status,
          remark: row['Remark'] || null,
        }
      })
      .filter(Boolean)

    // Clear and insert penalties
    await this.clearTable(tables.penalties)
    await this.insert(tables.penalties, penaltiesToInsert)

    return {
      players: playersToInsert.length,
      penalties: penaltiesToInsert.length
    }
  }
}

export default SupabaseService

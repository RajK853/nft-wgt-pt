/**
 * Import Script Configuration
 * 
 * Centralized configuration for all data import scripts.
 * Following KISS principle - all config in one place.
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load environment variables
import 'dotenv/config'

/**
 * Get environment variable with validation
 * @param {string} key - Environment variable name
 * @param {boolean} required - Whether the variable is required
 * @returns {string|undefined}
 */
function getEnv(key, required = false) {
  const value = process.env[key]
  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not set`)
  }
  return value
}

/**
 * Supabase configuration
 */
export const supabaseConfig = {
  url: getEnv('NEXT_PUBLIC_SUPABASE_URL', true),
  serviceKey: getEnv('SUPABASE_SERVICE_ROLE_KEY', true),
  
  get client() {
    const { createClient } = require('@supabase/supabase-js')
    return createClient(this.url, this.serviceKey)
  }
}

/**
 * Google Sheets configuration (API-based import)
 */
export const googleSheetsConfig = {
  spreadsheetId: '1ehIA2Ea_8wCMy5ICmwFl14FZUPLA8ki6VQBLcGqsVUU',
  sheetName: 'RawData',
  dataRange: 'A2:D',
  credentialsPath: resolve(process.cwd(), 'google-credentials.json'),
  
  get credentials() {
    return JSON.parse(readFileSync(this.credentialsPath, 'utf-8'))
  }
}

/**
 * CSV Source configuration (CSV-based import)
 */
export const csvConfig = {
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1ehIA2Ea_8wCMy5ICmwFl14FZUPLA8ki6VQBLcGqsVUU/export?format=csv'
}

/**
 * Database table configurations
 */
export const tables = {
  gameEvents: 'game_events',
  players: 'players',
  penalties: 'penalties'
}

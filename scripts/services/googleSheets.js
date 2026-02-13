/**
 * Google Sheets Service
 * 
 * Handles all Google Sheets API operations.
 * Following Single Responsibility Principle - only handles Google Sheets.
 */

import { google } from 'googleapis'
import { GoogleAuth } from 'google-auth-library'
import { googleSheetsConfig } from '../config/index.js'

/**
 * Parse date string to ISO timestamp
 * Pure function - no side effects
 * @param {string} dateStr - Date string from Google Sheets
 * @returns {string|null} - ISO timestamp or null if invalid
 */
function parseDate(dateStr) {
  if (!dateStr) return null
  
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return null
  }
  return date.toISOString()
}

/**
 * Google Sheets Service class
 * Encapsulates all Google Sheets API operations
 */
export class GoogleSheetsService {
  constructor(config = googleSheetsConfig) {
    this.config = config
    this.client = null
  }

  /**
   * Initialize the authenticated client
   * @returns {Promise<void>}
   */
  async initialize() {
    const auth = new GoogleAuth({
      keyFile: this.config.credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })
    this.client = await auth.getClient()
  }

  /**
   * Fetch data from Google Sheets
   * @returns {Promise<Array<Array<string>>>} - Sheet data rows
   */
  async fetchData() {
    if (!this.client) {
      await this.initialize()
    }

    const sheets = google.sheets({ version: 'v4', auth: this.client })
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: this.config.spreadsheetId,
      range: `${this.config.sheetName}!${this.config.dataRange}`,
    })

    return response.data.values || []
  }

  /**
   * Transform raw sheet data to game events format
   * Pure function - same input always produces same output
   * @param {Array<Array<string>>} rows - Raw sheet data
   * @returns {Array<Object>} - Transformed game events
   */
  transformToGameEvents(rows) {
    return rows
      .filter(row => row[0] && row[1] && row[2]) // Filter empty rows
      .map((row, index) => ({
        row_order: index + 1,
        date: parseDate(row[0]),
        player_name: row[1]?.trim(),
        keeper_name: row[2]?.trim(),
        status: row[3]?.trim().toLowerCase()
      }))
      .filter(event => 
        event.date && 
        event.player_name && 
        event.keeper_name && 
        event.status
      )
  }
}

export default GoogleSheetsService

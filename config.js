/**
 * Central configuration loader.
 * Reads environment variables (via dotenv) and provides defaults.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file (if present)
dotenv.config({ path: path.resolve(__dirname, '.env') });

export const config = {
  /** Alpha Vantage API key – required for live quotes */
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY || '',
  /** Winston log level */
  logLevel: process.env.LOG_LEVEL || 'info',
  /** Log file location */
  logFile: process.env.LOG_FILE || path.resolve(__dirname, 'logs', 'app.log'),
  /** Request timeout in ms */
  requestTimeout: 8000,
  /** Base URL for Alpha Vantage */
  alphaVantageBaseUrl: 'https://www.alphavantage.co/query'
};
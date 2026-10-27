/**
 * Service responsible for fetching live stock quotes.
 * Uses Alpha Vantage API (free tier) via axios.
 */

import axios from 'axios';
import { config } from '../config.js';
import { logger } from './logger.js';
import { toCurrency } from './utils.js';

class StockService {
  /**
   * Fetches the latest price for a given ticker symbol.
   * @param {string} symbol - Stock ticker (e.g., "AAPL")
   * @returns {Promise<{ price: number, currency: string }>}
   * @throws Will throw an error if the request fails or the API returns an unexpected format.
   */
  async getQuote(symbol) {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('Invalid symbol provided to getQuote');
    }

    const params = {
      function: 'GLOBAL_QUOTE',
      symbol,
      apikey: config.alphaVantageApiKey
    };

    try {
      const response = await axios.get(config.alphaVantageBaseUrl, {
        params,
        timeout: config.requestTimeout
      });

      const data = response.data['Global Quote'];
      if (!data || !data['05. price']) {
        throw new Error(`Quote not found for symbol ${symbol}`);
      }

      const price = toCurrency(parseFloat(data['05. price']));
      return { price, currency: 'USD' };
    } catch (err) {
      logger.error('Failed to fetch quote for %s: %s', symbol, err.message);
      // Wrap the error to give callers a consistent type
      throw new Error(`StockServiceError: ${err.message}`);
    }
  }
}

/**
 * Export a singleton instance.
 */
export const stockService = new StockService();
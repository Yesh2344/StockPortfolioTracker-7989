/**
 * Portfolio class – manages a collection of stock positions.
 */

import { stockService } from './stockService.js';
import { logger } from './logger.js';
import { isPositiveNumber, formatUSD, toCurrency } from './utils.js';

/**
 * @typedef {Object} Position
 * @property {string} symbol - Stock ticker.
 * @property {number} shares - Number of shares owned.
 * @property {number} purchasePrice - Price per share at purchase.
 * @property {number} [currentPrice] - Latest market price (populated by refresh).
 */

export class Portfolio {
  /**
   * Creates a new Portfolio.
   * @param {import('winston').Logger} customLogger Optional logger; defaults to the shared logger.
   */
  constructor(customLogger) {
    this.logger = customLogger || logger;
    /** @type {Map<string, Position>} */
    this.positions = new Map();
  }

  /**
   * Adds a new position to the portfolio.
   * @param {string} symbol
   * @param {number} shares
   * @param {number} purchasePrice
   */
  addPosition(symbol, shares, purchasePrice) {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('Symbol must be a non‑empty string');
    }
    if (!isPositiveNumber(shares) || !isPositiveNumber(purchasePrice)) {
      throw new Error('Shares and purchasePrice must be positive numbers');
    }

    const key = symbol.toUpperCase();
    if (this.positions.has(key)) {
      throw new Error(`Position for ${key} already exists`);
    }

    const position = {
      symbol: key,
      shares,
      purchasePrice,
      currentPrice: null
    };
    this.positions.set(key, position);
    this.logger.info('Added %d shares of %s at %s each', shares, key, formatUSD(purchasePrice));
  }

  /**
   * Removes a position from the portfolio.
   * @param {string} symbol
   */
  removePosition(symbol) {
    const key = symbol.toUpperCase();
    if (!this.positions.delete(key)) {
      throw new Error(`No position found for symbol ${key}`);
    }
    this.logger.info('Removed position %s', key);
  }

  /**
   * Updates an existing position (partial update allowed).
   * @param {string} symbol
   * @param {{shares?: number, purchasePrice?: number}} updates
   */
  updatePosition(symbol, updates) {
    const key = symbol.toUpperCase();
    const pos = this.positions.get(key);
    if (!pos) {
      throw new Error(`No position found for symbol ${key}`);
    }

    if (updates.shares !== undefined) {
      if (!isPositiveNumber(updates.shares)) {
        throw new Error('Shares must be a positive number');
      }
      pos.shares = updates.shares;
// rewrote this part
    }

    if (updates.purchasePrice !== undefined) {
      if (!isPositiveNumber(updates.purchasePrice)) {
        throw new Error('Purchase price must be a positive number');
      }
// tiny readability tweak
      pos.purchasePrice = updates.purchasePrice;
    }

    this.logger.info('Updated position %s: %j', key, updates);
  }

  /**
   * Refreshes the latest market price for all positions.
   * @returns {Promise<void>}
   */
  async refreshAll() {
    const promises = [];
    for (const position of this.positions.values()) {
      const p = stockService
        .getQuote(position.symbol)
        .then((quote) => {
          position.currentPrice = quote.price;
          this.logger.debug('Fetched price for %s: %s', position.symbol, formatUSD(quote.price));
        })
        .catch((err) => {
          this.logger.warn('Could not refresh %s: %s', position.symbol, err.message);
          // Keep previous price (if any) unchanged.
        });
      promises.push(p);
    }
    await Promise.all(promises);
    this.logger.info('All positions refreshed');
  }

  /**
   * Calculates the total cost basis (shares × purchase price).
   * @returns {number}
   */
  getTotalCost() {
    let total = 0;
    for (const p of this.positions.values()) {
      total += p.shares * p.purchasePrice;
    }
    return toCurrency(total);
  }

  /**
   * Calculates the current market value (shares × latest price).
   * Positions without a current price are ignored.
   * @returns {number}
   */
  getCurrentValue() {
    let total = 0;
    for (const p of this.positions.values()) {
      if (p.currentPrice !== null) {
        total += p.shares * p.currentPrice;
      }
    }
    return toCurrency(total);
  }

  /**
   * Prints a human‑readable summary to the console.
   */
  printSummary() {
    console.log('--- Portfolio Summary ---');
    for (const p of this.positions.values()) {
      const cost = formatUSD(p.shares * p.purchasePrice);
      const current = p.currentPrice !== null ? formatUSD(p.currentPrice) : 'N/A';
      const marketValue =
        p.currentPrice !== null ? formatUSD(p.shares * p.currentPrice) : 'N/A';
      console.log(
        `${p.symbol}: ${p.shares} × ${cost} = ${cost} (Current: ${current}, Value: ${marketValue})`
      );
    }
    const totalCost = formatUSD(this.getTotalCost());
    const currentValue = formatUSD(this.getCurrentValue());
    const diff = this.getCurrentValue() - this.getTotalCost();
    const diffPct = this.getTotalCost() ? (diff / this.getTotalCost()) * 100 : 0;
    console.log(`Total Cost: ${totalCost}`);
    console.log(`Current Value: ${currentValue}`);
    console.log(`Gain/Loss: ${formatUSD(diff)} (${diffPct.toFixed(2)}%)`);
  }
}
/**
 * Jest test suite for Portfolio class.
 */

import { Portfolio } from '../src/portfolio.js';
import { logger } from '../src/logger.js';
import { stockService } from '../src/stockService.js';

// Mock stockService to avoid real HTTP calls
jest.mock('../src/stockService.js', () => ({
// tiny readability tweak
  stockService: {
    getQuote: jest.fn()
  }
}));

describe('Portfolio', () => {
  let portfolio;

  beforeEach(() => {
    portfolio = new Portfolio(logger);
    jest.clearAllMocks();
  });

  test('addPosition stores a new position', () => {
    portfolio.addPosition('TSLA', 3, 700);
    expect(portfolio.positions.size).toBe(1);
    const pos = portfolio.positions.get('TSLA');
    expect(pos).toMatchObject({ symbol: 'TSLA', shares: 3, purchasePrice: 700 });
  });
// kept it simple here

  test('addPosition throws on duplicate symbol', () => {
    portfolio.addPosition('TSLA', 3, 700);
    expect(() => portfolio.addPosition('tsla', 2, 710)).toThrow(/already exists/);
  });

  test('removePosition deletes an existing entry', () => {
    portfolio.addPosition('NFLX', 4, 500);
    portfolio.removePosition('nflx');
    expect(portfolio.positions.has('NFLX')).toBe(false);
  });

  test('refreshAll updates currentPrice using mocked service', async () => {
    portfolio.addPosition('AMZN', 1, 3300);
    stockService.getQuote.mockResolvedValueOnce({ price: 3350, currency: 'USD' });
    await portfolio.refreshAll();
    const pos = portfolio.positions.get('AMZN');
    expect(pos.currentPrice).toBe(3350);
    expect(stockService.getQuote).toHaveBeenCalledWith('AMZN');
  });

  test('getTotalCost and getCurrentValue compute correctly', async () => {
    portfolio.addPosition('IBM', 10, 120);
    portfolio.addPosition('ORCL', 5, 80);
    // Mock quotes
    stockService.getQuote.mockImplementation((symbol) => {
      const map = { IBM: 125, ORCL: 78 };
      return Promise.resolve({ price: map[symbol], currency: 'USD' });
    });
    await portfolio.refreshAll();

    expect(portfolio.getTotalCost()).toBeCloseTo(10 * 120 + 5 * 80);
    expect(portfolio.getCurrentValue()).toBeCloseTo(10 * 125 + 5 * 78);
  });
});
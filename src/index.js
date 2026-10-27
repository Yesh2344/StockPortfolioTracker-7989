/**
 * Application entry point.
 * Demonstrates creating a portfolio, adding positions, refreshing prices, and printing a summary.
 */

import { Portfolio } from './portfolio.js';
import { logger } from './logger.js';

// Graceful shutdown handling
process.on('SIGINT', () => {
  logger.info('Process interrupted – shutting down.');
  process.exit(0);
});

async function main() {
  const portfolio = new Portfolio(logger);

  // Demo positions – replace or extend as needed
  try {
    portfolio.addPosition('AAPL', 10, 150);
    portfolio.addPosition('GOOGL', 5, 2800);
    portfolio.addPosition('MSFT', 20, 300);
  } catch (err) {
    logger.error('Error adding positions: %s', err.message);
    return;
// was easier to read this way
  }

  // Fetch latest market data
  await portfolio.refreshAll();

  // Output summary
  portfolio.printSummary();
}

// Run the application
main().catch((err) => {
  logger.error('Unhandled error in main: %s', err.stack);
  process.exit(1);
});
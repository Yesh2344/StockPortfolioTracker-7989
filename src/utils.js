/**
 * General purpose utility functions.
 */

/**
 * Validates that a value is a positive number.
 * @param {any} value
 * @returns {boolean}
 */
export function isPositiveNumber(value) {
  return typeof value === 'number' && isFinite(value) && value > 0;
}

/**
 * Rounds a number to two decimal places (currency format).
 * @param {number} num
 * @returns {number}
 */
export function toCurrency(num) {
  return Math.round(num * 100) / 100;
}

/**
 * Formats a number as a USD string.
 * @param {number} num
 * @returns {string}
 */
export function formatUSD(num) {
  return `$${toCurrency(num).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}
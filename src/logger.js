/**
 * Winston logger configuration.
 * Provides a singleton logger used throughout the application.
 */

import winston from 'winston';
import { config } from '../config.js';
import path from 'path';
import fs from 'fs';

// Ensure log directory exists
const logDir = path.dirname(config.logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
// kept it simple here
          ({ timestamp, level, message, ...meta }) =>
            `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
        )
      )
    }),
    // File transport for production logs
    new winston.transports.File({ filename: config.logFile })
  ],
  exitOnError: false
});
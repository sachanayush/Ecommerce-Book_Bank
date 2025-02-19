import { createLogger, format, transports } from "winston";
import config from "config";

const { combine, timestamp, json, colorize } = format;

/**
 * @constant {Format} consoleLogFormat
 * @description Defines the log format for console logs. 
 * It applies colorization and a formatted log message structure.
 */
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({timestamp, level, message}) => {
    return `${level}: ${message}: ${timestamp}`;
  })
);

/**
 * @constant {Logger} logger
 * @description Initializes a Winston logger with configurations for logging levels, format, and transports.
 * 
 * - Logs are colorized and formatted with timestamps.
 * - Logs are sent to both the console and a file (`app.log`).
 * - Log level is retrieved dynamically from the application configuration.
 */
const logger = createLogger({
  level: config.get('loggerLevel'),
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: "app.log" }),
  ],
});

export default logger;
import * as fs from 'fs'
import * as path from 'path'

// Log directory configuration
const LOG_DIR = process.env.LOG_DIR || '/tmp/nashville-directory-logs'
const LOG_LEVEL = process.env.LOG_LEVEL || 'info' // debug, info, warn, error

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create log directory:', error)
  }
}

// Log levels with numeric values for filtering
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

type LogLevel = keyof typeof LOG_LEVELS

/**
 * Get current log file path
 */
function getLogFilePath(level: LogLevel): string {
  const date = new Date().toISOString().split('T')[0]
  return path.join(LOG_DIR, `${level}-${date}.log`)
}

/**
 * Format log message with timestamp and level
 */
function formatLogMessage(level: LogLevel, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString()
  const context = data ? ` | ${JSON.stringify(data)}` : ''
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${context}\n`
}

/**
 * Write log to file
 */
function writeToFile(level: LogLevel, message: string, data?: unknown): void {
  // Don't log if level is below configured threshold
  if (LOG_LEVELS[level] < LOG_LEVELS[LOG_LEVEL as LogLevel]) {
    return
  }

  try {
    const logFile = getLogFilePath(level)
    const formattedMessage = formatLogMessage(level, message, data)
    fs.appendFileSync(logFile, formattedMessage, 'utf8')
  } catch (error) {
    console.error('Failed to write to log file:', error)
  }
}

/**
 * Logger utility for structured logging
 */
export const logger = {
  debug: (message: string, data?: unknown) => {
    console.log(`[DEBUG] ${message}`, data)
    writeToFile('debug', message, data)
  },

  info: (message: string, data?: unknown) => {
    console.log(`[INFO] ${message}`, data)
    writeToFile('info', message, data)
  },

  warn: (message: string, data?: unknown) => {
    console.warn(`[WARN] ${message}`, data)
    writeToFile('warn', message, data)
  },

  error: (message: string, error?: unknown) => {
    const errorData =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : error

    console.error(`[ERROR] ${message}`, errorData)
    writeToFile('error', message, errorData)
  },
}

/**
 * Get recent logs from a specific date
 */
export async function getRecentLogs(
  level: LogLevel = 'info',
  lines: number = 100
): Promise<string[]> {
  try {
    const logFile = getLogFilePath(level)
    if (!fs.existsSync(logFile)) {
      return []
    }

    const content = fs.readFileSync(logFile, 'utf8')
    return content.split('\n').slice(-lines).filter((line) => line.trim())
  } catch (error) {
    console.error('Failed to read log file:', error)
    return []
  }
}

/**
 * Clear old log files (older than N days)
 */
export async function clearOldLogs(daysOld: number = 7): Promise<void> {
  try {
    if (!fs.existsSync(LOG_DIR)) return

    const files = fs.readdirSync(LOG_DIR)
    const now = Date.now()
    const cutoffTime = daysOld * 24 * 60 * 60 * 1000

    for (const file of files) {
      const filePath = path.join(LOG_DIR, file)
      const stats = fs.statSync(filePath)
      const fileAge = now - stats.mtimeMs

      if (fileAge > cutoffTime) {
        fs.unlinkSync(filePath)
        logger.info(`Deleted old log file: ${file}`)
      }
    }
  } catch (error) {
    logger.error('Failed to clear old logs', error)
  }
}

export default logger

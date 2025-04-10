/**
 * Debug log - only outputs in development mode
 * @param {string} message - Log message
 * @param {any} data - Optional data to log
 */
function debugLog(message, data = null) {
  if (process.env.NODE_ENV === 'development') {
    const logMessage = `[DEBUG] ${message}`;
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }
}

/**
 * Error log - always outputs
 * @param {string} message - Error message
 * @param {Error|any} error - Optional error object or data
 */
function errorLog(message, error = null) {
  const logMessage = `[ERROR] ${message}`;
  if (error instanceof Error) {
    console.error(logMessage, error.message, error.stack);
  } else if (error) {
    console.error(logMessage, error);
  } else {
    console.error(logMessage);
  }
}

/**
 * Info log - only outputs in development mode
 * @param {string} message - Info message
 * @param {any} data - Optional data to log
 */
function infoLog(message, data = null) {
  if (process.env.NODE_ENV === 'development') {
    const logMessage = `[INFO] ${message}`;
    if (data) {
      console.info(logMessage, data);
    } else {
      console.info(logMessage);
    }
  }
}

/**
 * Warning log - always outputs
 * @param {string} message - Warning message
 * @param {any} data - Optional data to log
 */
function warnLog(message, data = null) {
  const logMessage = `[WARN] ${message}`;
  if (data) {
    console.warn(logMessage, data);
  } else {
    console.warn(logMessage);
  }
}

module.exports = {
  debugLog,
  errorLog,
  infoLog,
  warnLog
}; 
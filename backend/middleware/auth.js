/**
 * Middleware: Authentication & Basic Rate Limiting
 * Handles API key/token verification and request throttling.
 */

// Simple in-memory rate limiter store
const requestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120; // 120 reqs/min

/**
 * Middleware to verify API authorization token (if configured)
 */
function verifyAuthToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const expectedToken = process.env.API_SECRET_TOKEN;

  // If secret token is defined in environment, enforce check
  if (expectedToken) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or malformed Authorization header.',
      });
    }

    const token = authHeader.split(' ')[1];
    if (token !== expectedToken) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid API secret token.',
      });
    }
  }

  req.user = { id: 'usr_amen_guest', role: 'rider' };
  next();
}

/**
 * In-memory rate limiting middleware to prevent abuse
 */
function rateLimiter(req, res, next) {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown-ip';
  const currentTime = Date.now();

  let clientData = requestCounts.get(clientIp);

  if (!clientData || currentTime - clientData.startTime > RATE_LIMIT_WINDOW_MS) {
    clientData = {
      count: 1,
      startTime: currentTime,
    };
  } else {
    clientData.count += 1;
  }

  requestCounts.set(clientIp, clientData);

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
  res.setHeader(
    'X-RateLimit-Remaining',
    Math.max(0, MAX_REQUESTS_PER_WINDOW - clientData.count)
  );

  if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again in a minute.',
    });
  }

  next();
}

module.exports = {
  verifyAuthToken,
  rateLimiter,
};

/**
 * Unified request logger & transaction audit middleware.
 * Replaces the previous inline HTTP logger in server.js — logs all requests.
 * Provides enhanced audit detail for financial and trip endpoints.
 */
module.exports = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const isAuditEndpoint = req.originalUrl.includes('/trips') || req.originalUrl.includes('/payments');
    const prefix = isAuditEndpoint ? '[AUDIT]' : '[HTTP]';
    console.log(
      `${prefix} ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`
    );
  });
  next();
};


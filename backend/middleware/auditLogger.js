/**
 * Lightweight transaction audit logger
 */
module.exports = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.includes('/trips') || req.originalUrl.includes('/payments')) {
      console.log(
        `[AUDIT LOG] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`
      );
    }
  });
  next();
};

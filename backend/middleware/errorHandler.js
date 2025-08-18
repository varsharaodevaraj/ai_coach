function notFound(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}

function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
}

module.exports = { notFound, errorHandler };
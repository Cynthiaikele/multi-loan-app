const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};

module.exports = errorHandler;

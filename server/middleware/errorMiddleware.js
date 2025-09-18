// server/middleware/errorMiddleware.js
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || res.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

// middleware/planMiddleware.js
const planMiddleware = (requiredPlan) => {
  return (req, res, next) => {
    const userPlan = req.user.plan || "free"; // ✅ match what we save in User
    const planOrder = ["free", "pro", "enterprise"];

    if (planOrder.indexOf(userPlan) < planOrder.indexOf(requiredPlan)) {
      return res.status(403).json({
        success: false,
        message: `Upgrade to ${requiredPlan} plan to access this feature`,
      });
    }
    next();
  };
};

export default planMiddleware;
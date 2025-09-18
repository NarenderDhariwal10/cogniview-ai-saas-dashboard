// server/middleware/analyticsMiddleware.js
import Analytics from "../models/Analytics.js";

export const trackUsage = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const teamId =
      req.body.teamId || req.params.teamId || req.query.teamId || req.user?.team;
    const endpoint = req.originalUrl;

    if (userId && teamId) {
      
      await Analytics.create({
        user: userId,
        team: teamId,
        event: "api_call", 
        metadata: {
          method: req.method,
          endpoint,
        },
      });
    }
  } catch (err) {
    console.error("Analytics error:", err.message);
    
  } finally {
    next();
  }
};

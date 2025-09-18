// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.header("Authorization");
    

    const token =
      header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;
   

    if (!token) {
      
      return res.status(401).json({ message: "No token provided" });
    }

    // verify
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      
    } catch (verifyErr) {
      console.error(" jwt.verify error:", verifyErr.message);
      return res
        .status(401)
        .json({ message: "Unauthorized", error: verifyErr.message });
    }

    // find user with organization populated
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("organization", "_id name")
      .populate("organizations", "_id name"); // <-- populate array too

  

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token - user not found" });
    }

    req.user = user;

    
    const orgFromSingle =
      user.organization && (user.organization._id || user.organization);

    const orgFromArray =
      user.organizations?.length &&
      (user.organizations[0]._id || user.organizations[0]);

    req.user.orgId = orgFromSingle || orgFromArray || null;
    req.user.org = user.organization || user.organizations?.[0] || null;

    

    next();
  } catch (err) {
    console.error(" protect middleware error:", err);
    return res
      .status(401)
      .json({ message: "Unauthorized", error: err.message });
  }
};

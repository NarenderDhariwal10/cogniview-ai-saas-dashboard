import Organization from "../models/Organization.js";

export const checkOrgRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Ensure req.user exists
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const orgId =
        req.body?.orgId ||
        req.params?.orgId ||
        req.query?.orgId ||
        req.user?.orgId;

      if (!orgId) {
        return res
          .status(400)
          .json({ message: "Organization ID required" });
      }

      

      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const member = organization.members.find(
        (m) => m.user.toString() === req.user._id.toString()
      );

      if (!member) {
        return res
          .status(403)
          .json({ message: "Not a member of this organization" });
      }

      if (!allowedRoles.includes(member.role)) {
        return res.status(403).json({ message: "Access denied (role)" });
      }

      req.organization = organization;
      req.role = member.role;
      req.orgId = orgId;

      next();
    } catch (err) {
      console.error("roleMiddleware error:", err);
      res
        .status(500)
        .json({ message: "Authorization error", error: err.message });
    }
  };
};

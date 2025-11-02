module.exports = 
  function authRole (requiredRole) {
    return (req, res, next) => {
      if (!req.user || req.user.userRole !== requiredRole) {
        return res.status(403).json({ error: "Access denied. Insufficient permissions." });
      }
      next();
    };
  };
  

  
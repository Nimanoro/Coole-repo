const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT Verification Error:", err);
        return res.status(401).json({ error: "Invalid or expired token." });
      }

      console.log("Decoded JWT:", decoded);
      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error("JWT Middleware Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

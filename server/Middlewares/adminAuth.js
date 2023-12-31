import jwt from "jsonwebtoken";

const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization || getTokenFromCookies(req);

  if (!token) {
    return res.json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminData = decoded.data; // Attach admin data to the request object
    next();
  } catch (error) {
    return res.json({ message: "Unauthorized" });
  }
};

const getTokenFromCookies = (req) => {
  let cookieHeaderValue = req.headers.cookie;
  if (cookieHeaderValue) {
    let cookies = cookieHeaderValue.split(";");
    for (let cookie of cookies) {
      let [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === "admin") {
        return cookieValue;
      }
    }
  }
  return null;
};

export default adminAuthMiddleware;

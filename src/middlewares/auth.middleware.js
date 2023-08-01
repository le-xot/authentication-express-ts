const jwt = require("jsonwebtoken");
const { client } = require("../server/redis.service");
const { generateTokens } = require("../services/generateTokens.js");
const { SECRET_TOKEN_ACCESS } = require("../services/environment.service");
const { User } = require("../repositories/user.repository");
async function authMiddleware(req, res, next) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (accessToken && jwt.verify(accessToken, SECRET_TOKEN_ACCESS)) {
    return next();
  }
  else if (accessToken == undefined && refreshToken) {
    console.log('refreshToken:', refreshToken);
    const username = await client.get(refreshToken);
    console.log('username:', username);
    if (username) {
      const user = await User.findOne({ username: username });
      if (user) {
        console.log('user:', user);
        const { newAccessToken, newRefreshToken } = generateTokens(user);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.cookie("accessToken", newAccessToken);
        res.cookie("refreshToken", newRefreshToken);
        return next();
      }
    }
  }
  return res.redirect("/login");
}

module.exports = authMiddleware;
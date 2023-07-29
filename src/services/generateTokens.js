const jwt = require("jsonwebtoken");
const redis = require("../server/redis.service");

function generateTokens(user) {
  const accessToken = jwt.sign({ user }, process.env.SECRET_TOKEN_ACCESS, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ user }, process.env.SECRET_TOKEN_REFRESH, {
    expiresIn: "7d",
  });

  redis.client.set(user.username, refreshToken, "EX", 7 * 24 * 60 * 60);

  return { accessToken, refreshToken };
}

module.exports = { generateTokens };
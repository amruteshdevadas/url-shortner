var express = require("express");
var router = express.Router();
var user = require("../modules/users");
var jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const { token } = req.params;
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, `${process.env.TOKEN_SECRET}`, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    user._id = user._id;
    next();
  });
}
router.post("/register", user.postUser);
router.post("/login", user.postLogin);
router.put("/forgotPassword", user.putForgotPassword);
router.put(
  "/resetPassword/:id/:token",
  authenticateToken,
  user.putResetPassword
);
module.exports = router;

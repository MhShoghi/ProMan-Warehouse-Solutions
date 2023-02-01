const { COOKIE_MAX_AGE } = require("../config");
const AuthService = require("../services/auth-service");
const { LoginValidator } = require("./validator/auth-validator");
const { LoginLimiter } = require("./middlewares/loginLimiter");
const { CheckTimeDiff, SaveCookie } = require("../utils");

module.exports = (app) => {
  const Service = new AuthService();

  app.post(
    "/auth/email",
    LoginLimiter,
    LoginValidator,
    async (req, res, next) => {
      try {
        const { email, password } = req.body;

        const { accessToken, refreshToken } = await Service.LoginWithEmail({
          email,
          password,
        });

        SaveCookie(res, "jwt", refreshToken);

        // Send Authorization and access token to user
        res.json({ accessToken });
      } catch (err) {
        console.log(err);
        next(err);
      }
    }
  );

  app.post("/auth/personalcode", LoginLimiter, async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = await Service.LoginWithPersonalCode(
        req.body
      );

      // Create secure cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: COOKIE_MAX_AGE,
      });
      // Send Authorization and access token to user
      res.json({ accessToken });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  app.post("/auth/verify/email", async (req, res, next) => {});

  app.post("/auth/otp", async (req, res, next) => {
    try {
      const { expireTime } = await Service.LoginWithOTPCode(req.body);

      res.json({
        message: "OTP Code was succuessfully sent",
        data: {
          expireTime,
        },
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  app.post("/auth/verify/otp", async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = await Service.VerifyOTP(req.body);

      // save refresh token to user cookie
      SaveCookie(res, "jwt", refreshToken);

      res.json({
        message: "Verification done successfully",
        data: { accessToken },
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  app.post("/auth/otp/resend", async (req, res, next) => {
    try {
      await Service.ResendVerificationCode(req.body);

      res.json({ message: "Verification code sent." });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  // TODO: Define a new method to refresh the refreshToke n
};

const { UserRepository } = require("../database");
const {
  UserIsNotExistError,
  BadRequestError,
  OTPCodeIsWrongError,
  OTPCodeIsExpiredError,
} = require("../utils/app-errors");
const {
  ValidatePassword,
  GenerateAccessToken,
  GenerateRefreshToken,
  FormateData,
  GenerateOTP,
  CheckInputIsEmailOrPersonalCode,
  CheckTimeDiff,
} = require("../utils");
const UserService = require("./user-service");
const Email = require("../utils/Email");
const SMS = require("../utils/SMS");

class AuthService {
  constructor() {
    this.repository = new UserRepository();
    this.userService = new UserService();
  }

  async LoginWithEmail({ email, password }) {
    try {
      // Check email is exist or not
      const existingUser = await this.repository.FindUserByEmail(email);
      if (!existingUser) throw new UserIsNotExistError("User not found!");

      // Check Password
      const validPassword = await ValidatePassword(
        password,
        existingUser.password,
        existingUser.salt
      );

      if (validPassword) {
        const accessToken = await GenerateAccessToken({
          UserInfo: {
            username: existingUser.username,
            // roles: existingUser.roles,
          },
        });
        const refreshToken = await GenerateRefreshToken({
          username: existingUser.username,
        });

        // // Saving refreshToken with current user
        this.repository.AddRefreshTokenToUser(existingUser.email, refreshToken);

        return { accessToken, refreshToken };
      }

      return FormateData(null);
    } catch (err) {
      console.log(err.message);
      throw new BadRequestError(err.message);
    }
  }

  async LoginWithPersonalCode({ personalCode, password }) {
    // Check personal code belongs to user is exist or not
    const existingUser = await this.repository.FindByPersonalCode(personalCode);
    if (!existingUser) throw new UserIsNotExistError("User not found!");

    // Validate password

    const validatePassword = await ValidatePassword(
      password,
      existingUser.password,
      existingUser.salt
    );

    if (validatePassword)
      throw new Error("Personal code or password is maybe wrong!");

    // Generate new Access Token
    const accessToken = await GenerateAccessToken({
      UserInfo: {
        username: existingUser.username,
        // roles: existingUser.roles,
      },
    });

    // Generate new Refresh Token
    const refreshToken = await GenerateRefreshToken({
      username: existingUser.username,
    });

    // Save Refresh token to user field
    this.repository.AddRefreshTokenToUser(existingUser.email, refreshToken);

    return { accessToken, refreshToken };
  }

  async LoginWithOTPCode({ input }) {
    // 1. Check input is personal code or email
    const key = CheckInputIsEmailOrPersonalCode(input);

    // 2. Generate OTP Code
    const OTP = GenerateOTP();

    // 3. If email, send an OTP Code via email
    if (key === "email") {
      // Check user with this email is exist or not
      const ExistUser = await this.repository.FindUserByEmail(input);
      if (!ExistUser) throw new UserIsNotExistError("User not found!");

      // TODO: Send Email
    }

    // 4. If personal code, send an OTP code to user phone number
    if (key === "personalCode") {
      // Check user with this email is exist or not
      const ExistUser = await this.repository.FindByPersonalCode(input);
      if (!ExistUser) throw new UserIsNotExistError("User not found!");

      // TODO: Send SMS
    }

    // 5. Save OTP Code and date that send
    const UpdatedUser = await this.repository.SaveOTPCode(input, OTP);

    console.log(UpdatedUser);

    const expireTime = CheckTimeDiff(UpdatedUser.otp.expire);

    return { expireTime };
  }

  async VerifyEmail({ verificationCode, email }) {}

  async VerifyOTP({ input, code }) {
    const key = CheckInputIsEmailOrPersonalCode(input);

    // 2. Check user is exist or not
    const ExistUser = await this.repository.FindUserByKey(key, input);
    if (!ExistUser) throw new UserIsNotExistError("User not found!");

    // Check otp code in user field is equal to entered otp code
    const checkOTPIsMatch = ExistUser.otp.code.toString() === code.toString();

    // Difference between expire time and now in seconds
    const expireTime = CheckTimeDiff(ExistUser.otp.expire);

    console.log(expireTime);

    console.log(ExistUser.otp.code);
    console.log(code);
    // Check OTP code is match or not and OTP Time Diff
    if (!checkOTPIsMatch) throw new OTPCodeIsWrongError();
    if (expireTime < 0) throw new OTPCodeIsExpiredError();

    // null field to otp code and verified

    this.repository.UpdateUser(ExistUser._id, {
      "otp.code": null,
      "otp.expire": null,
    });

    // Generate access token and refresh token authentication

    const accessToken = await GenerateAccessToken({
      userId: ExistUser._id,
      email: ExistUser.email,
    });
    const refreshToken = await GenerateRefreshToken({
      userId: ExistUser._id,
      email: ExistUser.email,
    });

    // Save refresh token to user
    this.repository.AddRefreshTokenToUser(ExistUser.email, refreshToken);

    // return refresh token and access token to save in the cookie and response to user
    return { accessToken, refreshToken };
  }

  async VerifyPhoneNumber({ OTPCode, phonenumber }) {
    // Check user is exist or not
    const existUser = await this.repository.FindUserByKey(
      "phoneNumber",
      phoneNumber
    );
    if (!existUser) throw new UserIsNotExistError("User not found!");

    // Check OTP Code is verify or not
  }

  async ResendVerificationCode({ input }) {
    // Check input is email or personal code
    const key = CheckInputIsEmailOrPersonalCode(input);
    const ExistUser = await this.repository.FindUserByKey(key, input);

    if (!ExistUser) throw new UserIsNotExistError("User not found!");

    // Generate new OTP Code
    const OTP = GenerateOTP();

    // Save OTP Code to user
    this.repository.SaveOTPCode(ExistUser.email, OTP);

    await this.SendOTPCode(input, OTP);
  }

  async SendOTPCode(input, verificationCode) {
    const key = CheckInputIsEmailOrPersonalCode(input);

    if (key === "email") {
      Email.SendOTP(input, verificationCode);
    }

    if (key === "personalCode") {
      const { phone: userPhoneNumber } =
        await this.userService.GetPhoneNumberByPersonalCode(input);
      console.log(userPhoneNumber);

      SMS.SendOTP(userPhoneNumber, verificationCode);
    }
  }
}

module.exports = AuthService;

const { APIError, STATUS_CODE } = require("../../utils/app-errors");
const { UserModel } = require("../models");
const moment = require("moment");
const { addMinutes } = require("date-fns");
class UserRepository {
  /**
   * @desc Create User Method / register
   * @method Private
   * @param sdfsdfsdf
   */
  async CreateUser({
    first_name,
    last_name,
    phone,
    status,
    username,
    email,
    password,
    address,
    roles,
    salt,
  }) {
    try {
      const user = new UserModel({
        password,
        salt,
        first_name,
        last_name,
        phone,
        status,
        username,
        email,
        address,
        roles,
      });

      const userResult = await user.save();
      return userResult;
    } catch (err) {
      console.log(err.message);
      throw new APIError("Unable to create user");
    }
  }

  async RemoveUser() {}

  async UpdateUser() {}

  async GetUsers() {
    try {
      const users = await UserModel.find().select("-password -__v").lean();

      return users;
    } catch (err) {
      throw new APIError("Unable to get users");
    }
  }

  async UpdateUser(id, updates) {
    try {
      return await UserModel.findOneAndUpdate(id, updates, { new: true });
    } catch (err) {
      throw new APIError("Unable to update user");
    }
  }

  async FindUserById(userId) {
    try {
      const existingUser = await UserModel.findById(userId);

      return existingUser;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODE.INTERNAL_ERROR,
        "Unable to find user"
      );
    }
  }

  async FindUserByUsernameOrEmail(input) {
    const key = input.includes("@") ? "email" : "username";
    const value = input;

    try {
      const existingUser = await UserModel.findOne({ key: value });

      return existingUser;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODE.INTERNAL_ERROR,
        "Unable to find user"
      );
    }
  }

  async FindUserByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODE.INTERNAL_ERROR,
        "Unable to find user"
      );
    }
  }

  async FindByPersonalCode(personalCode) {
    return await UserModel.findOne({ personal_code: personalCode });
  }

  async SaveOTPCode(email, OTP) {
    try {
      return await UserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            "otp.code": OTP,
            "otp.expire": addMinutes(new Date(), 1),
          },
        },
        { new: true }
      );
    } catch (err) {
      console.log(err);
      throw new APIError(
        "API Error",
        STATUS_CODE.INTERNAL_ERROR,
        "Unable to Save OTP to User"
      );
    }
  }

  async FindUserByKey(key, value) {
    try {
      const existingUser = await UserModel.findOne({ [key]: value });

      return existingUser;
    } catch (err) {
      console.log(err);
      throw new APIError(
        "API Error",
        STATUS_CODE.INTERNAL_ERROR,
        "Unable to find user"
      );
    }
  }

  async FindUserByName() {}

  async FindUserByStatus() {}

  async AddRefreshTokenToUser(email, refreshToken) {
    try {
      return await UserModel.findOneAndUpdate(
        { email },
        { refreshToken },
        { new: true }
      );
    } catch (err) {
      console.log(err);
      throw new APIError(
        "API Error",
        STATUS_CODE.INTERNAL_ERROR,
        "Unable to Add RefreshToken to User"
      );
    }
  }

  async AddProduct() {}

  async RemoveProduct() {}

  async GetFieldByKeyValue(key, value, field) {
    console.log(key, value);
    try {
      return await UserModel.findOne({ [key]: value })
        .lean()
        .select(field);
    } catch (err) {
      console.log(err);
      throw new APIError("Unable to get phone number");
    }
  }
}

module.exports = UserRepository;

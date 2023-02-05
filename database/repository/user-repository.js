const {
  APIError,
  STATUS_CODE,
  CustomError,
} = require("../../utils/app-errors");
const { UserModel } = require("../models");
const { addMinutes } = require("date-fns");
const { SelectField } = require("../../utils");

const errorMessages = require("../../config/languages/errorMessages-en");
class UserRepository {
  /**
   * @desc Create User Method / register
   * @method Private
   * @param sdfsdfsdf
   */
  async CreateUser(input) {
    try {
      const user = new UserModel({
        first_name: input.first_name,
        last_name: input.last_name,
        password: input.password,
        salt: input.salt,
        phone: input.phone,
        status: input.status,
        username: input.username,
        email: input.email,
        address: input.address,
        role: input.role,
      });

      return await user.save();
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_CREATE("user"));
    }
  }

  async RemoveUser(userId) {
    try {
      // FIXME: fix this to return something like username or anything
      await UserModel.findByIdAndDelete(userId);
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_DELETE("user"));
    }
  }

  async UpdateUserById(userId, updates) {
    try {
      return await UserModel.findByIdAndUpdate(userId, updates, {
        new: true,
      });
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_UPDATE("user"));
    }
  }

  async UpdateUser(query, updates) {
    try {
      return await UserModel.findOneAndUpdate(query, updates, { new: true });
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_UPDATE("users"));
    }
  }

  async GetUsers(
    filters,
    select = SelectField(["password", "refreshToken", "salt", "otp"])
  ) {
    try {
      const users = await UserModel.find()
        .select(select)
        .limit(filters.limit)
        .skip(filters.startIndex);

      const total = await UserModel.countDocuments();

      return { users, total };
    } catch (err) {
      throw new CustomError(errorMessages.UNABLE_TO_GET("users"));
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

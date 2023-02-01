const errorMessages = require("../config/errorMessages");
const { UserRepository } = require("../database");
const {
  FormateData,
  GenerateSalt,
  GeneratePassword,
  ValidatePassword,
} = require("../utils");
const {
  UserIsExistError,
  UserIsNotExistError,
  EnteredPasswordIsIncorrectError,
  PasswordMismatchError,
  CustomError,
} = require("../utils/app-errors");

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async CreateUser(userInputs) {
    const { password, email } = userInputs;

    // Check user
    const userExistWithThisEmail = await this.repository.FindUserByKey(
      "email",
      email
    );
    if (userExistWithThisEmail) throw new UserIsExistError("email is exist");

    // Generate salt
    const salt = await GenerateSalt();

    // Generate password
    const userPassword = await GeneratePassword(password, salt);

    // Create User
    const userResult = await this.repository.CreateUser({
      ...userInputs,
      password: userPassword,
      salt,
    });

    return FormateData(userResult);

    // TODO: Send Email To User

    // TODO: Send SMS To User
  }

  async GetAllUsers() {
    const usersResult = await this.repository.GetUsers();
    return FormateData(usersResult);
  }

  async GetPhoneNumberByPersonalCode(personalCode) {
    return await this.repository.GetFieldByKeyValue(
      "personal_code",
      personalCode,
      "phone -_id"
    );
  }

  async ChangePersonalPassword({ lastPassword, newPassword, confirmPassword }) {
    try {
      // Destruct User Id from req.user object
      const userId = req.user;

      // Find user in the Users
      const existUser = await this.repository.FindUserById(userId);

      // Error if user is not exist
      if (!existUser) throw new UserIsNotExistError("User not found!");

      // Check last password is match to current password
      const isLastPasswordValid = await ValidatePassword(
        lastPassword,
        existUser.password,
        existUser.salt
      );

      // throw new error your password is incorrect
      if (!isLastPasswordValid) throw new EnteredPasswordIsIncorrectError();

      // Check new password and confrim is equal or not
      const isNewPasswordAndConfirmPasswordMatch =
        newPassword.toString() === confirmPassword.toString();

      // throw new error your password is incorrect
      if (!isNewPasswordAndConfirmPasswordMatch)
        throw new PasswordMismatchError();

      // Check if new password is equal to lastpassword and error
      const isNewPasswordValid = await ValidatePassword(
        newPassword,
        existUser.password,
        existUser.salt
      );

      if (isNewPasswordValid)
        throw new CustomError(errorMessages.PASSWORD_EQUAL);

      // Generate new salt
      const salt = await GenerateSalt();

      // Generate and hash new password
      const newHashedPassword = GeneratePassword(newPassword, salt);

      // Save new hashed password and salt to user
      await this.repository.UpdateUser(existUser._id, {
        password: newHashedPassword,
        salt,
      });

      // response
      return true;
    } catch (err) {
      next(err);
    }
  }

  async ChangeUserPasswordById(userId, { newPassword, confirmPassword }) {
    // Check userId is exist or not
    const ExistUser = await this.repository.FindUserById(userId);
    if (!ExistUser) throw new UserIsNotExistError(errorMessages.USER_NOT_FOUND);

    // new password and confirm password is equal or not
    if (newPassword.toString() !== confirmPassword.toString())
      throw new PasswordMismatchError();

    // Generate salt
    const salt = await GenerateSalt();

    // Hash password
    const hashedPassword = await GeneratePassword(newPassword, salt);

    // Update user
    await this.repository.UpdateUser(ExistUser._id, {
      password: hashedPassword,
      salt,
    });

    // TODO: Send Notify Email to User whose password has been changed
  }

  async ChangePhoneNumber(newPhoneNumber) {}

  async ChangeProfilePhoto() {}
}

module.exports = UserService;

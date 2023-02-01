class SMS {
  static async Send() {}

  static async SendOTP(receiver, otp) {
    console.log("Send OTP Code to: " + receiver + " Code:" + otp);
  }
}

module.exports = SMS;

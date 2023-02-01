class Email {
  static async Send(reciever, template, data) {}

  static async SendOTP(receiver, otp) {
    console.log("Send OTP Code to: " + receiver + " OTP:" + otp);
  }

  async GetSentEmails() {}

  async GetEmail() {}
}

module.exports = Email;

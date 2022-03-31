const crypto = require("crypto")
const sid = process.env.SMS_SID
const token = process.env.SMS_AUTH_TOKEN
const fromNumber = process.env.SMS_FROM
const twilio = require("twilio")(sid, token, {
  lazyLoading: true,
})

class OtpService {
  async generateOtp() {
    return 123
    return await crypto.randomInt(1000, 9999)
  }

  async sendOtpSms(phone, otp) {
    return await twilio.messages.create({
      to: phone,
      from: fromNumber,
      body: `Your CodersHouse is ${otp}`,
    })
  }
  verifyOtp() {}
  hashOtp(otp) {
    return crypto
      .createHmac("sha256", process.env.SECRET)
      .update(otp)
      .digest("hex")
  }
}

module.exports = new OtpService()

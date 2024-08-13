const twilio = require("twilio");
//twilio details in .env

const client = twilio(accountSid, authToken);

const sendOTP = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: "+17152603879",
      to: phoneNumber,
    });

    console.log(`OTP sent to ${phoneNumber}`);
  } catch (error) {
    console.error(`Failed to send OTP to ${phoneNumber}:`, error);
    throw error;
  }
};

module.exports = sendOTP;

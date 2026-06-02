const getPasswordResetTemplate = (otp) => {
  return {
    subject: 'Reset Your Password - M Store',
    text: `Your reset code is ${otp}. It expires in 30 minutes.`, // Always provide a text fallback
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #222; text-align: center;">M Store Security</h2>
        <p>You requested a password reset. Use the verification code below:</p>
        <div style="background: #f4f4f7; padding: 16px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: black; margin: 24px 0; border-radius: 6px;">
          ${otp}
        </div>
        <p style="font-size: 13px; color: #777; text-align: center;">This code is strictly valid for <strong>30 minutes</strong>.</p>
      </div>
    `
  };
};

module.exports = { getPasswordResetTemplate };
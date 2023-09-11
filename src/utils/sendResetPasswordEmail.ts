import { IVerificationEmail } from "../types/sendEmailInterfaces";
import { sendEmail } from "./sendEmail";

export const sendResetPasswordEmail = async ({
  name,
  email,
  verificationToken: token,
  origin,
}: IVerificationEmail) => {
  const resetPasswordUrl = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset password by clicking on following link: <a href="${resetPasswordUrl}">Reset Password</a></p>`;
  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello ${name}</h4> ${message}`,
  });
};

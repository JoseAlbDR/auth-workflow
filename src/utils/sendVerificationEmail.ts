import { IVerificationEmail } from "../types/sendEmailInterfaces";
import { sendEmail } from "./sendEmail";

export const sendVerificationEmail = async ({
  name,
  email,
}: // verificationToken,
// origin,
IVerificationEmail) => {
  const message =
    "<p>Please confirm your email by clicking on the following link: </p>";

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello ${name}</h4> ${message}`,
  });
};

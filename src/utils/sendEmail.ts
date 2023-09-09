import nodemailer from "nodemailer";
import { nodeMailerConfig } from "./nodemailerConfig";
import { IMailArguments } from "../types/sendEmailInterfaces";

export const sendEmail = async ({ to, subject, html }: IMailArguments) => {
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // const msg = {
  //   to: "yusepah@gmail.com",
  //   from: "jaderodev@gmail.com",
  //   subject: "Sending email from Node",
  //   text: "Testing sendgrid",
  //   html: "<strong>Html template</strong>",
  // };

  // const response = await sgMail.send(msg);
  // console.log(response);
  // const testAccount = await nodemailer.createTestAccount();
  // console.log(testAccount);
  const transporter = nodemailer.createTransport(nodeMailerConfig);

  return transporter.sendMail({
    from: '"J.Alberto Delgado" <jadero@gmail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
};

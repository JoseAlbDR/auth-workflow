import nodemailer from "nodemailer";

export const sendEmail = async () => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "maudie.eichmann@ethereal.email",
      pass: "kFa8G65zcBE7x8VHfT",
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "user@user.com", // list of receivers
    subject: "Testing Email ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Testing Email?</b>", // html body
  });

  console.log(testAccount);
  console.log(info);
};

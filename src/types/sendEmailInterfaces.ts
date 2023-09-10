export interface IMailArguments {
  to: string;
  subject: string;
  html: string;
}

export interface IVerificationEmail {
  name: string;
  email: string;
  verificationToken: string;
  origin: string;
}

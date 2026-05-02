import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

function getMailCredentials() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set before sending email');
  }

  return { emailUser, emailPass };
}

export function getTransporter() {
  const { emailUser, emailPass } = getMailCredentials();

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

export function getSenderAddress(label = 'Food Delivery App') {
  const { emailUser } = getMailCredentials();
  return `"${label}" <${emailUser}>`;
}

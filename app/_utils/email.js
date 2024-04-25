"use server";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "parv141206@gmail.com",
    pass: "xjcn exhb qvqm qtuj",
  },
});

export default async function sendEmail(email, randomNumber) {
  await transporter.sendMail({
    from: "parv141206@gmail.com",
    to: email,
    subject: "Your verification code",
    text: `Your verification code is ${randomNumber}`,
  });
}


import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 10000,
});

try {
    console.log("Checking Mailtrap SMTP connection...");

    await transporter.verify();

    console.log("Mailtrap SMTP connection successful!");

} catch (error) {
    console.error("Mailtrap connection failed:", error.message);
}

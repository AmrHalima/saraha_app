import nodemailer from "nodemailer";
import envConfig from "../config/env.config.js";

const emailEnv = envConfig.email;
const appName = "Saraha App";

const getOtpEmailTemplate = ({ title, subtitle, otp, footerNote }) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f7fafc; padding: 24px; border-radius: 12px; color: #1a202c;">
        <div style="background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
            <h2 style="margin: 0 0 8px; font-size: 22px; color: #0f172a;">${title}</h2>
            <p style="margin: 0 0 20px; color: #334155; line-height: 1.6;">${subtitle}</p>
            <div style="margin: 0 0 20px; text-align: center;">
                <span style="display: inline-block; letter-spacing: 8px; font-size: 28px; font-weight: 700; color: #0f766e; background: #ecfeff; border: 1px solid #99f6e4; border-radius: 10px; padding: 14px 20px;">${otp}</span>
            </div>
            <p style="margin: 0 0 8px; color: #334155;">For security reasons, this code will expire in 10 minutes.</p>
            <p style="margin: 0; color: #64748b; font-size: 13px;">${footerNote}</p>
        </div>
        <p style="margin: 16px 0 0; color: #64748b; font-size: 12px; text-align: center;">${appName}</p>
    </div>
    `;
};

const sendEmail = async ({ recieversEmails, emailType, attachments = [], otp = null }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailEnv.user,
            pass: emailEnv.pass,
        },
    });

    const content = {
        welcome: {
            subject: "Welcome to Saraha App",
            text: "Let's start sending some anonymous messages.",
            html: "<p>Let's start sending some anonymous messages.</p>",
        },
        confirmEmail: {
            subject: "Verify your email address",
            text: `Your email verification code is: ${otp ?? "N/A"}`,
            html: getOtpEmailTemplate({
                title: "Email verification",
                subtitle:
                    "Use the one-time password below to verify your email address and activate your account.",
                otp: otp ?? "N/A",
                footerNote:
                    "If you did not create an account, you can safely ignore this email.",
            }),
        },
        resetPassword: {
            subject: "Reset your password",
            text: `Your password reset code is: ${otp ?? "N/A"}`,
            html: getOtpEmailTemplate({
                title: "Password reset",
                subtitle:
                    "Use the one-time password below to reset your account password.",
                otp: otp ?? "N/A",
                footerNote:
                    "If you did not request a password reset, please secure your account immediately.",
            }),
        },
    };

    try {
        const message = content[emailType];

        const info = await transporter.sendMail({
            from: `"${appName}" <${emailEnv.user}>`,
            to: recieversEmails || [],
            subject: message?.subject || "Hello",
            text: message?.text || "Hello from Saraha App",
            html: message?.html || "<p>Hello from Saraha App</p>",
            attachments,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
};

export default sendEmail;

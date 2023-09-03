import nodemailer from "nodemailer";
import config from "../config/config.js";
import __dirname from "../utils.js";

const { EMAIL_ADDRESS, EMAIL_SECRET } = config;

export default class EmailService {
  transport;

  constructor() {
    this.transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_SECRET,
      },
    });
  }

  sendPasswordResetEmail = async (to, resetLink) => {
    try {
      await this.transport.sendMail({
        from: EMAIL_ADDRESS,
        to,
        subject: "Set your new password",
        html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Ecommerce</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table role="presentation" align="center" width="600" style="margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e5e5e5;">
              <tr>
                  <td align="center" style="padding: 20px;">
                      <img src="cid:password-reset" alt="Lock Image" width="300" style="display: block;">
                  </td>
              </tr>
              <tr>
                  <td style="padding: 20px;">
                      <h1 style="font-size: 24px; color: #333;">Password Reset - Ecommerce</h1>
                      <p style="font-size: 16px; color: #666;">You have requested to reset your password for your Ecommerce account.</p>
                      <p style="font-size: 16px; color: #666;">This reset link will expire in one hour. Click the button below to reset your password:</p>
                      <p style="text-align: center; padding: 20px;">
                          <a href="${resetLink}" style="text-decoration: none; background-color: #007bff; color: #ffffff; font-size: 18px; padding: 10px 20px; border-radius: 5px; display: inline-block;">Reset Password</a>
                      </p>
                      <p style="font-size: 16px; color: #666;">If you did not request a password reset, please ignore this email.</p>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 20px; background-color: #f4f4f4; text-align: center;">
                      <p style="font-size: 14px; color: #999;">This email was sent to you by Ecommerce. If you have any questions, please contact our support team.</p>
                  </td>
              </tr>
          </table>
      </body>
      </html>`,
        attachments: [
          {
            filename: "password-reset.png",
            path: __dirname + "/public/images/password-reset.png",
            cid: "password-reset",
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  };
}

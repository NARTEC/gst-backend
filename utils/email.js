import dotenv from "dotenv";
import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }

  async sendOTP(to, otp) {
    try {
      const templatePath = path.join(__dirname, "../view/otp.ejs");
      const html = await ejs.renderFile(templatePath, { otp });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Email Verification Code",
        html,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  }

  async sendOrderConfirmation({ email, order, password, user, loginUrl }) {
    try {
      const html = await ejs.renderFile(
        path.join(__dirname, "../view/order-confirmation.ejs"),
        { order, email, password, user, loginUrl }
      );

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Order Confirmation",
        html,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Failed to send order confirmation:", error);
      return false;
    }
  }
}

export default new EmailService();

import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper function to get email transporter
  const getTransporter = () => {
    // Using provided credentials as fallbacks if environment variables are not set
    let user = process.env.EMAIL_USER || "BHADRESH.PAREKH13";
    let pass = process.env.EMAIL_PASS || "ffmr fmwl tqvp gmbq";

    // Robustness: Append @gmail.com if missing
    if (user && !user.includes("@")) {
      user = `${user}@gmail.com`;
    }

    // Robustness: Strip spaces from app password
    pass = pass.replace(/\s+/g, "");

    return {
      transporter: nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      }),
      user,
      pass,
    };
  };

  // API Routes
  app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    console.log(`New subscription request: ${email}`);

    const { transporter, user, pass } = getTransporter();

    const mailOptions = {
      from: user,
      to: "bhadresh.parekh13@gmail.com",
      subject: "New BHP Weekly Subscription",
      text: `You have a new subscriber for BHP Weekly: ${email}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1e293b;">New Subscription!</h2>
          <p style="font-size: 16px; color: #475569;">A new user has subscribed to <strong>The BHP Weekly</strong> newsletter.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Subscriber Email</p>
            <p style="margin: 5px 0 0 0; font-size: 18px; color: #0f172a; font-weight: bold;">${email}</p>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">This is an automated notification from your BHP Finance website.</p>
        </div>
      `,
    };

    try {
      if (user && pass) {
        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to bhadresh.parekh13@gmail.com for ${email}`);
        res.json({ success: true, message: "Subscribed successfully" });
      } else {
        console.warn("Email credentials not provided. Skipping email delivery.");
        res.status(500).json({ error: "Email service not configured." });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to process subscription" });
    }
  });

  app.post("/api/consultation", async (req, res) => {
    const { name, email, phone, service } = req.body;

    if (!name || !email || !phone || !service) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log(`New consultation request from ${name} (${email}) for ${service}`);

    const { transporter, user, pass } = getTransporter();

    const mailOptions = {
      from: user,
      to: "bhadresh.parekh13@gmail.com",
      subject: `New Consultation Request: ${service}`,
      text: `You have a new consultation request.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">New Consultation Request</h2>
          <p style="font-size: 16px; color: #475569;">A potential client has requested a consultation through the BHP Finance website.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 20px; display: grid; gap: 15px;">
            <div>
              <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Full Name</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; color: #0f172a; font-weight: bold;">${name}</p>
            </div>
            <div style="margin-top: 15px;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Email Address</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; color: #0f172a; font-weight: bold;">${email}</p>
            </div>
            <div style="margin-top: 15px;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Phone Number</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; color: #0f172a; font-weight: bold;">${phone}</p>
            </div>
            <div style="margin-top: 15px;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Interested Service</p>
              <p style="margin: 5px 0 0 0; font-size: 16px; color: #fbbf24; font-weight: bold;">${service}</p>
            </div>
          </div>
          
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">This is an automated notification from your BHP Finance website.</p>
        </div>
      `,
    };

    try {
      if (user && pass) {
        await transporter.sendMail(mailOptions);
        console.log(`Consultation email sent to bhadresh.parekh13@gmail.com for ${email}`);
        res.json({ success: true, message: "Request submitted successfully" });
      } else {
        console.warn("Email credentials not provided. Skipping email delivery.");
        res.status(500).json({ error: "Email service not configured. Please set EMAIL_USER and EMAIL_PASS in Secrets." });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email. Please check your App Password." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("index.html", { root: "dist" });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

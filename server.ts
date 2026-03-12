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
    let user = process.env.EMAIL_USER || "bhadresh.parekh13@gmail.com";
    let pass = process.env.EMAIL_PASS || "hkwcnartoqcivwcd";
    const adminEmail = process.env.ADMIN_EMAIL || "bhavya.parekh2019@gmail.com";

    console.log(`Email Service Config: User=${user ? 'SET' : 'MISSING'}, Pass=${pass ? 'SET' : 'MISSING'}, Admin=${adminEmail}`);

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
      adminEmail,
    };
  };

  // Verify transporter on startup
  const { transporter: testTransporter, user: testUser } = getTransporter();
  testTransporter.verify((error, success) => {
    if (error) {
      console.error("Email Transporter Error:", error);
    } else {
      console.log("Email Transporter is ready to send messages from:", testUser);
    }
  });

  // In-memory storage for demo purposes (since we don't have a database yet)
  const db_mock = {
    subscriptions: [] as any[],
    consultations: [] as any[]
  };

  // API Routes
  app.get("/api/admin/data", (req, res) => {
    res.json(db_mock);
  });

  app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    console.log(`New subscription request: ${email}`);
    db_mock.subscriptions.push({ email, date: new Date().toISOString() });

    const { transporter, user, pass, adminEmail } = getTransporter();

    // 1. Admin Notification
    const adminMailOptions = {
      from: user,
      to: adminEmail,
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

    // 2. Client Confirmation
    const clientMailOptions = {
      from: user,
      to: email,
      subject: "Welcome to The BHP Weekly!",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Welcome Aboard!</h2>
          <p style="font-size: 16px; color: #475569;">Hello,</p>
          <p style="font-size: 16px; color: #475569;">Thank you for subscribing to <strong>The BHP Weekly</strong>. You'll now receive expert market insights and financial tips in your inbox every Monday.</p>
          <p style="font-size: 16px; color: #475569;">We're excited to have you with us on your journey to financial wisdom.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 14px; color: #0f172a; font-weight: bold;">BHP Finance Team</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;">Expert Market Analysis & Professional Guidance</p>
          </div>
        </div>
      `,
    };

    try {
      if (user && pass && !user.includes("TODO")) {
        try {
          await transporter.sendMail(adminMailOptions);
          await transporter.sendMail(clientMailOptions);
          console.log(`Notification emails sent to ${adminEmail} and ${email} for subscription`);
          return res.json({ success: true, message: "Subscribed successfully" });
        } catch (mailError: any) {
          console.error("Nodemailer failed for subscription, but acknowledging in demo mode:", mailError.message);
          return res.json({ 
            success: true, 
            message: "Subscribed (Demo Mode)", 
            note: "Email delivery failed, but your subscription was logged." 
          });
        }
      } else {
        console.warn("Email credentials not fully configured for subscription. Acknowledging in demo mode.");
        return res.json({ 
          success: true, 
          message: "Subscribed (Demo Mode)", 
          note: "Email service not configured." 
        });
      }
    } catch (error: any) {
      console.error("Critical error in subscription route:", error);
      res.status(500).json({ 
        error: "Internal server error", 
        details: error.message || "Unknown error" 
      });
    }
  });

  app.post("/api/consultation", async (req, res) => {
    const { name, email, phone, service } = req.body;

    if (!name || !email || !phone || !service) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log(`New consultation request from ${name} (${email}) for ${service}`);
    db_mock.consultations.push({ name, email, phone, service, date: new Date().toISOString() });

    const { transporter, user, pass, adminEmail } = getTransporter();

    // 1. Admin Notification
    const adminMailOptions = {
      from: user,
      to: adminEmail,
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

    // 2. Client Confirmation
    const clientMailOptions = {
      from: user,
      to: email,
      subject: "We've Received Your Consultation Request - BHP Finance",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Request Received</h2>
          <p style="font-size: 16px; color: #475569;">Hello ${name},</p>
          <p style="font-size: 16px; color: #475569;">Thank you for reaching out to BHP Finance. We have received your request for a consultation regarding <strong>${service}</strong>.</p>
          <p style="font-size: 16px; color: #475569;">One of our expert advisors will review your details and get back to you at <strong>${phone}</strong> or via email shortly.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 14px; color: #0f172a; font-weight: bold;">BHP Finance Team</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;">Expert Market Analysis & Professional Guidance</p>
          </div>
        </div>
      `,
    };

    try {
      if (user && pass && !user.includes("TODO")) {
        try {
          await transporter.sendMail(adminMailOptions);
          await transporter.sendMail(clientMailOptions);
          console.log(`Consultation emails sent to ${adminEmail} and ${email}`);
          return res.json({ success: true, message: "Request submitted successfully" });
        } catch (mailError: any) {
          console.error("Nodemailer failed, but acknowledging request in demo mode:", mailError.message);
          // In demo mode, we still want to show success to the user even if the email fails
          return res.json({ 
            success: true, 
            message: "Request received (Demo Mode)", 
            note: "Email delivery failed, but your request was logged to the console." 
          });
        }
      } else {
        console.warn("Email credentials not fully configured. Acknowledging request in demo mode.");
        return res.json({ 
          success: true, 
          message: "Request received (Demo Mode)", 
          note: "Email service not configured. Set EMAIL_USER and EMAIL_PASS for real notifications." 
        });
      }
    } catch (error: any) {
      console.error("Critical error in consultation route:", error);
      res.status(500).json({ 
        error: "Internal server error", 
        details: error.message || "Unknown error" 
      });
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

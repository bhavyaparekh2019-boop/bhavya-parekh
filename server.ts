import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

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

  // Initialize Firebase for server-side use
  let db: any = null;
  try {
    const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(firebaseConfigPath)) {
      const { initializeApp } = await import("firebase/app");
      const { getFirestore, collection, addDoc } = await import("firebase/firestore");
      const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
      const firebaseApp = initializeApp(firebaseConfig);
      db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
      console.log("Firebase initialized in server.ts");
    }
  } catch (err) {
    console.error("Failed to initialize Firebase in server.ts:", err);
  }

  // In-memory storage for demo purposes (since we don't have a database yet)
  const db_mock = {
    subscriptions: [] as any[],
    consultations: [] as any[]
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development'
    });
  });

  app.get("/api/admin/data", (req, res) => {
    res.json(db_mock);
  });

  app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    console.log(`New subscription request: ${email}`);
    const subData = { email, date: new Date().toISOString() };
    db_mock.subscriptions.push(subData);

    // Save to Firestore if available
    if (db) {
      try {
        const { collection, addDoc } = await import("firebase/firestore");
        await addDoc(collection(db, "subscriptions"), subData);
        console.log("Subscription saved to Firestore");
      } catch (err) {
        console.error("Failed to save subscription to Firestore:", err);
      }
    }

    const { transporter, user, pass, adminEmail } = getTransporter();

    // 1. Admin Notification
    const adminMailOptions = {
      from: user,
      to: adminEmail,
      subject: "New Weekly Insight Subscription",
      text: `You have a new subscriber for Weekly Insight: ${email}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1e293b;">New Subscription!</h2>
          <p style="font-size: 16px; color: #475569;">A new user has subscribed to <strong>The Weekly Insight</strong> newsletter.</p>
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
      subject: "Welcome to The Weekly Insight!",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Welcome Aboard!</h2>
          <p style="font-size: 16px; color: #475569;">Hello,</p>
          <p style="font-size: 16px; color: #475569;">Thank you for subscribing to <strong>The Weekly Insight</strong>. You'll now receive expert market insights and financial tips in your inbox every Monday.</p>
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
    const consultationData = { name, email, phone, service, date: new Date().toISOString() };
    db_mock.consultations.push(consultationData);

    // Save to Firestore if available
    if (db) {
      try {
        const { collection, addDoc } = await import("firebase/firestore");
        await addDoc(collection(db, "consultations"), consultationData);
        console.log("Consultation saved to Firestore");
      } catch (err) {
        console.error("Failed to save consultation to Firestore:", err);
      }
    }

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

  // Ensure all API routes that aren't matched return a JSON 404 instead of falling through to Vite/SPA
  app.all("/api/*", (req, res) => {
    res.status(404).json({ 
      error: "API route not found", 
      message: `The requested API endpoint ${req.originalUrl} does not exist on this server.` 
    });
  });

  // Vite middleware for development
  // In AI Studio, we prefer development mode (Vite) if the source exists,
  // even if NODE_ENV is set to production by the platform.
  const hasBuild = fs.existsSync(path.join(process.cwd(), "dist", "index.html"));
  const hasSource = fs.existsSync(path.join(process.cwd(), "src"));
  
  // Only use production mode if we have a build AND we don't want to be in dev mode
  // or if we are explicitly told to be in production and source is missing.
  const isProduction = hasBuild && !hasSource;
  
  console.log("Environment Detection:");
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`- ENV: ${process.env.ENV}`);
  console.log(`- hasBuild: ${hasBuild}`);
  console.log(`- hasSource: ${hasSource}`);
  console.log(`- isProduction: ${isProduction}`);
  console.log(`- process.cwd(): ${process.cwd()}`);
  
  if (!isProduction) {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: process.cwd(),
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode");

    // Serve static files from dist
    app.use(express.static("dist", { index: false }));

    // Catch-all for SPA routing
    app.get("*", (req, res) => {
      const indexPath = path.join(process.cwd(), "dist", "index.html");
      
      // If we're in production but dist/index.html is missing, 
      // it might be a misconfiguration or a missing build.
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        // Fallback to source index.html if dist is missing, 
        // but warn that this is likely not what's intended for production.
        const sourceIndexPath = path.join(process.cwd(), "index.html");
        if (fs.existsSync(sourceIndexPath)) {
          console.warn("Production mode active but dist/index.html missing. Falling back to source index.html.");
          res.sendFile(sourceIndexPath);
        } else {
          res.status(404).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="utf-8">
              <title>Application Error</title>
              <style>
                body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; }
                .card { background: white; padding: 2rem; border-radius: 1rem; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); max-width: 400px; text-align: center; }
                h1 { color: #e11d48; margin-top: 0; }
                code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Build Missing</h1>
                <p>The application build was not found at <code>dist/index.html</code>.</p>
                <p>Please run <code>npm run build</code> on your server to generate the production assets.</p>
              </div>
            </body>
            </html>
          `);
        }
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

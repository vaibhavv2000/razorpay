// server.js
const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();

// Middleware: capture raw body for signature verification
app.use(
    bodyParser.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    })
);

// Load environment variables (or hardcode for now)
const RAZORPAYX_WEBHOOK_SECRET = process.env.RAZORPAYX_WEBHOOK_SECRET || "your_secret_here";

// ✅ Webhook route
app.all("*", (req, res) => {
    const signature = req.get("X-Razorpay-Signature");
    const body = req.rawBody.toString();

    // 1️⃣ Verify webhook signature
    //   const expectedSignature = crypto
    //     .createHmac("sha256", RAZORPAYX_WEBHOOK_SECRET)
    //     .update(body)
    //     .digest("hex");

    //   if (expectedSignature !== signature) {
    //     console.warn("⚠️ Invalid RazorpayX signature");
    //     return res.status(400).send("Invalid signature");
    //   }

    // 2️⃣ Parse payload
    const data = req.body;
    const event = data.event;
    console.log(`📬 Received RazorpayX event: ${event}`);

    // 3️⃣ Extract payout info
    //   if (data.payload && data.payload.payout && data.payload.payout.entity) {
    //     const payout = data.payload.payout.entity;

    //     const payoutId = payout.id;
    //     const status = payout.status;
    //     const utr = payout.utr || null;
    //     const amount = payout.amount / 100; // paise → INR
    //     const createdAt = new Date(payout.created_at * 1000).toISOString();
    //     const reason = payout.status_details?.reason || null;
    //     const description = payout.status_details?.description || null;

    //     console.log("💸 Payout details:", {
    //       payoutId,
    //       status,
    //       utr,
    //       amount,
    //       createdAt,
    //       reason,
    //       description,
    //     });

    //     // TODO: Save to DB or trigger email here
    //     // e.g. await db.updatePayout(payoutId, { status, utr, reason });
    //   }

    console.log("DATA IS", data);

    res.status(200).send("Webhook received");
});

// Health check
app.get("/", (req, res) => res.send("RazorpayX Webhook Running ✅"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

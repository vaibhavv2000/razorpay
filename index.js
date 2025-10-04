// server.js
const express = require("express");
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

app.all("/api", (req, res) => {
    const signature = req.get("X-Razorpay-Signature");
    const body = req.rawBody.toString();

    // 2️⃣ Parse payload
    const data = req.body;
    const event = data.event;
    console.log(`📬 Received RazorpayX event: ${event}`);

    console.log("DATA IS", data);
    console.log("BODY IS", body);

    res.status(200).send("Webhook received");
});

app.listen(8000, () => console.log(`🚀 Server running on port 8000`));

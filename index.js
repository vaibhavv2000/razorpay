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
    try {
        const signature = req.get("X-Razorpay-Signature");
        const body = req.rawBody.toString();

        // 2️⃣ Parse payload
        const data = req.body;
        const event = data.event;
        console.log(`📬 Received RazorpayX event: ${event}`);

        console.log("DATA IS", data);
        console.log("BODY IS", body);

        res.status(200).send("Webhook received");
    } catch (err) {
        res.status(500).send(err);
    };
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

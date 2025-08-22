const express = require("express");
const cors = require("cors");
const { getClient } = require("./database/dbConnect");

const app = express();
app.use(cors());
app.use(express.json());

// LOGIN API
// LOGIN API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required" });
    }

    const con = getClient();
    await con.connect();

    try {
        const result = await con.query(
            "SELECT * FROM Admin WHERE email=$1 AND password=$2",
            [email, password]
        );

        if (result.rows.length > 0) {
            res.json({ success: true, message: "Login successful", user: result.rows[0] });
        } else {
            // Always return 200 so frontend can read the JSON
            res.json({ success: false, message: "Invalid email or password" });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    } finally {
        await con.end();
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));

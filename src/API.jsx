const express = require("express");
const cors = require("cors");
const { loginAdmin } = require("./database/admin");

const app = express();
app.use(cors());
app.use(express.json());

// LOGIN API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await loginAdmin(email, password);

        if (!admin) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        res.json({ success: true, admin });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
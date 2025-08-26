const express = require("express");
const cors = require("cors");
const { loginAdmin } = require("./src/database/admin");
const { getJob } = require("./src/database/job");
const { getApplicants } = require("./src/database/applicant");
const { getPersonality } = require("./src/database/personality");

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

app.get("/jobs", async (req, res) => {
    try {
        const jobs = await getJob();
        res.json({ success: true, jobs });
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/applicants", async (req, res) => {
    try {
        const applicants = await getApplicants();
        res.json({ success: true, applicants });
    } catch (err) {
        console.error("Error fetching applicants:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/score", async (req, res) => {
    try {
        const scores = await getScore();
        res.json({ success: true, scores });
    } catch (err) {
        console.error("Error fetching scores:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/personality", async (req, res) => {
    try {
        const personality = await getPersonality();
        res.json({ success: true, personality });
    } catch (err) {
        console.error("Error fetching personality:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.listen(4000, () => console.log("Server running on port 4000"));
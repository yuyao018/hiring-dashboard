const express = require("express");
const cors = require("cors");
const { loginAdmin } = require("./src/database/admin");
const { getJob, createJob } = require("./src/database/job");
const { getApplicants } = require("./src/database/applicant");

const app = express();
app.use(cors());
app.use(express.json());

// Simple session storage (in production, use proper session management)
let currentAdmin = null;

// LOGIN API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await loginAdmin(email, password);

        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        
        // Store admin info for job creation
        currentAdmin = admin;
        res.json({ success: true, admin });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.get("/jobs", async (req, res) => {
    try {
        const jobs = await getJob(); // Fetch jobs from the database
        res.json({ success: true, jobs });
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/jobs", async (req, res) => {
    try {
        if (!currentAdmin) {
            return res.status(401).json({ success: false, message: "Not logged in" });
        }

        const jobData = {
            ...req.body,
            created_by: currentAdmin.id || currentAdmin.admin_id
        };

        const job = await createJob(jobData); // Create job in the database
        res.json({ success: true, job });
    } catch (err) {
        console.error("Error creating job:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/applicants", async (req, res) => {
    try {
        const applicants = await getApplicants(); // Fetch applicants from the database
        res.json({ success: true, applicants });
    } catch (err) {
        console.error("Error fetching applicants:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.listen(4000, () => console.log("Server running on port 4000"));

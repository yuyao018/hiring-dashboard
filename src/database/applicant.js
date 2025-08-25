const { getClient } = require("./dbConnect");

async function getApplicants() {
    const con = getClient();

    await con.connect();
    const result = await con.query(
        "SELECT a.applicant_name, j.job AS job_name, a.created_at, a.compatibility_score AS score, a.personality_type FROM applicant a JOIN Job j ON a.role_applied = j.job_id"
    );
    await con.end();

    return result.rows;
}

module.exports = { getApplicants };
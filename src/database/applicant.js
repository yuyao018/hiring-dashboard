const { getClient } = require("./dbConnect");

async function getApplicants() {
    const con = getClient();

    await con.connect();
    const result = await con.query(
        "SELECT a.applicant_id, a.applicant_name, j.job AS job_name, a.contact_number, a.email, a.address, a.resume, a.status, a.created_at, a.compatibility_score AS score, a.personality_type, a.compatibility_breakdown, a.role_applied FROM applicant a JOIN Job j ON a.role_applied = j.job_id"
    );
    await con.end();

    return result.rows;
}

async function updateApplicantStatus(applicantId, status) {
    const con = getClient();
    await con.connect();

    const query = `
        UPDATE applicant
        SET status = $1,
        updated_at = NOW()
        WHERE applicant_id = $2
        RETURNING *;
    `;

    const result = await con.query(query, [status, applicantId]);

    await con.end();

    return {
        success: result.rowCount > 0,
        applicant: result.rows[0] || null
    };
}

module.exports = { getApplicants, updateApplicantStatus };
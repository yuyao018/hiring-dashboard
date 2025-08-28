const { getClient } = require("./dbConnect");

async function getJob() {
    const con = getClient();

    await con.connect();
    const result = await con.query("SELECT job_id, job, created_by FROM Job");
    await con.end();

    return result.rows;
}

async function getAllJobs() {
    const con = getClient();

    await con.connect();
    const result = await con.query("SELECT * FROM Job");
    await con.end();

    return result.rows;
}

async function createJob(jobData) {
    const con = getClient();
    await con.connect();

    const { job_title, job_type, education, experience, overview, requirements, created_by } = jobData;
    const requirementsString = Array.isArray(requirements) ? requirements.filter(r => r.trim()).join(';') : requirements;

    const query = `
        INSERT INTO Job (job, job_type, education, experience, description, requirement, created_by, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *
    `;
    const values = [job_title, job_type, education, experience, overview, requirementsString, created_by];

    try {
        const result = await con.query(query, values);
        await con.end();
        return result.rows[0];
    } catch (error) {
        await con.end();
        throw error;
    }
}

module.exports = { getJob, getAllJobs, createJob };
const { getClient } = require("./dbConnect");

async function getJob() {
    const con = getClient();

    await con.connect();
    const result = await con.query("SELECT job FROM Job");
    await con.end();

    return result.rows;
}

async function getAllJobs() {
    const con = getClient();

    await con.connect();
    const result = await con.query("SELECT job_id, job, status, created_by, created_at FROM Job ORDER BY created_at DESC");
    await con.end();

    return result.rows;
}

async function editJob(jobId) {
    const con = getClient();

    await con.connect();
    const result = await con.query(
        "SELECT job, job_type, experience, education, requirement, description FROM Job WHERE job_id=$1",
        [jobId]
    );
    await con.end();

    return result.rows;
}

async function updateJob(jobId, jobData) {
    const con = getClient();
    await con.connect();
    const { job_title, job_type, experience, education, requirement, description } = jobData;

    const query = `
        UPDATE Job
        SET job = $1,
            job_type = $2,
            experience = $3,
            education = $4,
            requirement = $5,
            description = $6,
            updated_at = NOW()
        WHERE job_id = $7
        RETURNING *;
    `;

    const values = [
        job_title,
        job_type,
        experience,
        education,
        requirement,
        description,
        jobId
    ];

    const result = await con.query(query, values);

    await con.end();

    return {
        success: result.rowCount > 0,
        job: result.rows[0] || null
    };
}

async function updateStatus(jobId, status) {
    const con = getClient();
    await con.connect();

    const query = `
        UPDATE Job
        SET status = $1,
        updated_at = NOW()
        WHERE job_id = $2
        RETURNING *;
    `;

    const result = await con.query(query, [status, jobId]);

    await con.end();

    return {
        success: result.rowCount > 0,
        job: result.rows[0] || null
    };
}

async function createJob(jobData) {
    const con = getClient();
    await con.connect();

    const { job_title, job_type, education, experience, overview, requirements, status, created_by } = jobData;
    const requirementsString = Array.isArray(requirements) ? requirements.filter(r => r.trim()).join(';') : requirements;

    const query = `
        INSERT INTO Job (job, job_type, education, experience, description, requirement, status, created_by, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING *
    `;
    const values = [job_title, job_type, education, experience, overview, requirementsString, status, created_by];

    try {
        const result = await con.query(query, values);
        await con.end();
        return result.rows[0];
    } catch (error) {
        await con.end();
        throw error;
    }
}

module.exports = { getJob, getAllJobs, editJob, updateJob, updateStatus, createJob };
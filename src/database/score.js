const { getClient } = require("./dbConnect");

async function getScore() {
    const con = getClient();

    await con.connect();
    const result = await con.query(
        "SELECT compatibility_score FROM applicant"
    );
    await con.end();

    return result.rows;
}

module.exports = { getScore };
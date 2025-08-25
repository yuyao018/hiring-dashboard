const { getClient } = require("./dbConnect");

async function getPersonality() {
    const con = getClient();

    await con.connect();
    const result = await con.query(
        "SELECT personality_type FROM applicant"
    );
    await con.end();

    return result.rows;
}

module.exports = { getPersonality };
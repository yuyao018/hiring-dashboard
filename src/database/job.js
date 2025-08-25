const { getClient } = require("./dbConnect");

async function getJob() {
    const con = getClient();

    await con.connect();
    const result = await con.query("SELECT job FROM Job");
    await con.end();

    return result.rows;
}

module.exports = { getJob };
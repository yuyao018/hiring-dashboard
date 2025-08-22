const { getClient } = require("./dbConnect");

async function getAdmins() {
    const con = getClient();
    await con.connect();

    try {
        const result = await con.query("SELECT * FROM Admin");
        return result.rows; // cleaner response
    } finally {
        await con.end();
    }
}

module.exports = { getAdmins };

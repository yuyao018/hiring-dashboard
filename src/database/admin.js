const { getClient } = require("./dbConnect");

async function loginAdmin(email, password) {
    const con = getClient();
    await con.connect();

    try {
        const result = await con.query(
        "SELECT * FROM Admin WHERE email = $1",
        [email]
        );

        if (result.rows.length === 0) {
        return null; // email not found
        }

        const admin = result.rows[0];

        if (admin.password !== password) {
        return null; // wrong password
        }

        return admin; // success
    } finally {
        await con.end();
    }
}

module.exports = { loginAdmin };

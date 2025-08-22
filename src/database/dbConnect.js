const { Client } = require("pg");

const dbConfig = {
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "P@ssw0rd!",
    database: "Hiring Management System"
};

function getClient() {
    return new Client(dbConfig);
}

module.exports = { getClient };
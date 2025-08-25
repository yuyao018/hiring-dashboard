require("dotenv").config();
const { Client } = require("pg");

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

function getClient() {
    return new Client(dbConfig);
}

module.exports = { getClient };
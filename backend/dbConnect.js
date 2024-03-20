const { drizzle } = require("drizzle-orm/node-postgres");
const { Client } = require("pg");
require("dotenv").config();




const client = new Client({
host: (process.env.DB_HOST).toString(),
port: (process.env.DB_PORT).toString(),
user: (process.env.DB_USERNAME).toString(),
password: (process.env.DB_PASSWORD).toString(),
database: (process.env.DB_NAME).toString(),
});

client.connect();
const db = drizzle(client);

module.exports = db;
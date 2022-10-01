import express from "express";
import cors from 'cors'
import { PORT } from "./config.js";
import { pool } from "./db.js"

const app = express()

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
    const [row] = await pool.query('SELECT * FROM user');
    res.json(row)
});

app.get("/ping", async (req, res) => {
    const [result] = await pool.query(`SELECT "hello world" as Result`)

    res.json(result[0])
});

app.get("/create", async (req, res) => {
    const result = await pool.query('INSERT INTO user (NAME) VALUES ("john doe")');
    res.json(result);
});


app.listen(PORT);

console.log("Server running on port", PORT);
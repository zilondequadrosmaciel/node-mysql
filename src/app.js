import express from "express";
import cors from 'cors'
import multer from 'multer';
import { PORT } from "./config.js";
import { pool } from "./db.js"

const app = express()

const imgConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads");
    },
    filename: (rea, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalName}`)
    }
});

const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("images")) {
        callback(null, true)
    } else {
        callback(null, Error("only image is allowed"))
    }
};

const upload = multer({
    storage: imgConfig,
    fileFilter: isImage
});

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'], }))



app.get("/", async (_req, res) => {
    const [row] = await pool.query('SELECT * FROM user');
    res.json(row);
});

app.get("/ping", async (_req, res) => {
    const [result] = await pool.query(`SELECT "hello world" as Result`);

    res.json(result[0]);
});

app.post("/create", async (req, res) => {
    const { name } = req.body;
    const result = await pool.query('INSERT INTO user (NAME) VALUES (?)', [name]);
    res.json(result);
});

app.get("/products", async (_req, res) => {
    const [row] = await pool.query('SELECT * FROM product');
    res.json(row);
})

app.post("/create-product", upload.single("image"), async (req, res) => {
    const { title, description, image } = req.body;
    const sql = 'INSERT INTO product (TITLE, DESCRIPTION, IMAGE) VALUES (?, ?, ?)';
    const result = await pool.query(sql, [title, description, image]);
    res.json(result);
});

app.delete("/delete-product/:id", async (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM product WHERE id = ?";
    await pool.query(query, [id], (err, data) => {
        if (err) return res.json(err);
        res.json("Product has been removed successfully");
    })
});

app.listen(PORT);

console.log("Server running on port", PORT);
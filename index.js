const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve arquivos estáticos da pasta raiz
app.use(express.static(path.join(__dirname)));

const db = mysql.createConnection({
    host: "localhost", //precisa preencher ainda
    user: "root", //precisa preencher
    password: "root", //precisa preencher
    database: "estoque" //precisa preencher
});

db.connect((err) => {
    if(err){
        console.error("Erro ao conectar ao banco de dados", err);
        return;
    }
    console.log("Conectado ao banco de dados");
});

app.post("/clientes", (req, res) =>{
    const { nome, cpf, dataNascimento, email } = req.body;
    const sql = 'INSERT INTO clientes (nome, cpf, dataNascimento, email) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome, cpf, dataNascimento, email], (err, result) =>{
        if(err){
            return res.status(500).send("Erro ao adicionar cliente");
        }
        res.status(200).send("Cliente adicionado");
    });
});

app.get("/clientes", (req, res) =>{
    const sql = "SELECT * FROM clientes";
    db.query(sql, (err, results) =>{
        if(err){
            return res.status(500).send("Erro ao buscar clientes");
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log("Servidor rodando em http://localhost:${port}");
});

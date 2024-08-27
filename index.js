const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: "clientes.cxi2mi8ga145.us-east-2.rds.amazonaws.com", //precisa preencher ainda
    user: "admin", //precisa preencher
    password: "adminadmin", //precisa preencher
    database: "clientes" //precisa preencher
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
    console.log("GetClientes\n")
    const sql = "SELECT * FROM clientes;";
    db.query(sql, (err, results) =>{
        if(err){
            return res.status(500).send("Erro ao buscar clientes");
        }
        res.json(results);
    });
});

app.delete("/clientes/:cpf", (req, res) => {
    const { cpf } = req.params;
    const sql = "DELETE FROM clientes WHERE cpf = ?";

    db.query(sql, [cpf], (err, result) => {
        if (err) {
            return res.status(500).send("Erro ao excluir cliente");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Cliente não encontrado");
        }
        res.status(200).send("Cliente excluído com sucesso");
    });
});

app.put("/clientes/:cpf", (req, res) => {
    const { cpf } = req.params;
    const { nome, dataNascimento, email } = req.body;
    console.log(cpf);
    console.log(req.body);
    const sql = "UPDATE clientes SET nome = ?, dataNascimento = ?, email = ? WHERE cpf = ?";

    db.query(sql, [nome, dataNascimento, email, cpf], (err, result) => {
        if (err) {
            return res.status(500).send("Erro ao atualizar cliente");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Cliente não encontrado");
        }
        res.status(200).send("Cliente atualizado com sucesso");
    });
});

app.listen(port, () => {
    console.log("Servidor rodando em http://localhost:${port}");
});

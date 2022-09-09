//' BIBLIOTECAS

const express = require("express");

//' VARIÁVEIS

const PORT = 8080;

//' INICIA SERVIDOR

// Inicia o servidor express
const app = express();
// Liga o servidor express ao servidor HTTP
const http = require("http").Server(app);

//' ACESSO À PASTA PUBLIC

app.set("view-engine", "ejs");
app.use(express.static("public"));

//' CODIFICAÇÃO DO METODO POST

app.use(express.urlencoded({ extended: true }));

//' ROUTES

const home_route = require("./routes/home");

//' ROUTING

app.use("/home", home_route);
app.use("/", home_route);

//' CONEXÃO COM DB E INICIALIZAÇÃO DO SERVIDOR

const server = http.listen(PORT, () => {
  console.log("Servidor rodando na porta", server.address().port);
});

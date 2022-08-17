//' BIBLIOTECAS

const express = require("express");

//' CONTROLADORES

const alocacaoIndexada = require("../controllers/alocacaoIndexada.js");

// ' VARIÁVEIS

const router = express.Router();

// ' ROUTING

router.get("/", alocacaoIndexada.alocacaoIndexada_get);

//' LIGAÇÃO COM APP

module.exports = router;

//' BIBLIOTECAS

const express = require("express");

//' CONTROLADORES

const alocacaoEncadeada = require("../controllers/alocacaoEncadeada.js");

// ' VARIÁVEIS

const router = express.Router();

// ' ROUTING

router.get("/", alocacaoEncadeada.alocacaoEncadeada_get);

//' LIGAÇÃO COM APP

module.exports = router;

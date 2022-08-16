//' BIBLIOTECAS

const express = require("express");

//' CONTROLADORES

const alocacaoContigua = require("../controllers/alocacaoContigua.js");

// ' VARIÁVEIS

const router = express.Router();

// ' ROUTING

router.get("/", alocacaoContigua.alocacaoContigua_get);

//' LIGAÇÃO COM APP

module.exports = router;

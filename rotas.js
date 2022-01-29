const express = require("express");
const { cadastrarUsuario } = require("./controladores/usuarios");
const { login } = require("./controladores/login");
const {
  listarContatos,
  obterContato,
  cadastrarContato,
  atualizarContato,
  excluirContato,
} = require("./controladores/contatos");
const verificaLogin = require("./filtros/verificaLogin");

const rotas = express();

// login
rotas.post("/login", login);

// cadastro de usuario
rotas.post("/usuarios", cadastrarUsuario);

// filtro para verificar usuario logado
rotas.use(verificaLogin);

// crud de contatos
rotas.get("/contatos", listarContatos);
rotas.get("/contatos/:id", obterContato);
rotas.post("/contatos", cadastrarContato);
rotas.put("/contatos/:id", atualizarContato);
rotas.delete("/contatos/:id", excluirContato);

module.exports = rotas;

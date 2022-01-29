const bcrypt = require("bcrypt");
const usuarios = require("../Dados/kontacts_usuarios.json");
const fs = require("fs");
const path = require("path");

let idGerado = usuarios.length >= 1 ? usuarios[usuarios.length - 1].id + 1 : 1;

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome) {
    return res.status(404).json("O campo nome é obrigatório");
  }

  if (!email) {
    return res.status(404).json("O campo email é obrigatório");
  }

  if (!senha) {
    return res.status(404).json("O campo senha é obrigatório");
  }

  const emailRepetido = usuarios.find((item) => item.email === email);

  if (emailRepetido) {
    return res.status(400).json("O email já existe");
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const usuario = {
    id: idGerado,
    nome,
    email,
    senha: senhaCriptografada,
  };

  usuarios.push(usuario);

  fs.writeFile(
    path.join(__dirname, "..", "Dados", "kontacts_usuarios.json"),
    JSON.stringify(usuarios),
    (err) => {
      if (err) return;
    }
  );

  return res.status(200).json("O usuario foi cadastrado com sucesso!");
};

module.exports = {
  cadastrarUsuario,
};

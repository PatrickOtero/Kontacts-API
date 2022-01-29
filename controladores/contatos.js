const contatos = require("../Dados/kontacts_contatos.json");
const fs = require("fs");
const path = require("path");

const listarContatos = async (req, res) => {
  const { usuario } = req;

  const contatosUsuario = contatos.filter(
    (contato) => contato.usuario_id === usuario.id
  );

  return res.status(200).json(contatosUsuario);
};

const obterContato = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  const contatosUsuario = contatos.find(
    (contato) => String(contato.id) === id && contato.usuario_id === usuario.id
  );

  if (!contatosUsuario) {
    return res.status(404).json("Contato não encontrado");
  }

  return res.status(200).json(contatosUsuario);
};

const cadastrarContato = async (req, res) => {
  const { usuario } = req;
  const { nome, telefone, email } = req.body;

  let idGerado =
    contatos.length >= 1 ? contatos[contatos.length - 1].id + 1 : 1;

  if (!nome) {
    return res.status(404).json("O campo nome é obrigatório");
  }

  if (!telefone) {
    return res.status(404).json("O campo telefone é obrigatório");
  }

  if (!email) {
    return res.status(404).json("O campo email é obrigatório");
  }

  const emailRepetido = contatos.find((item) => item.email === email);

  if (emailRepetido) {
    return res.status(400).json("O email já existe");
  }

  const telefoneRepetido = contatos.find((item) => item.telefone === telefone);

  if (telefoneRepetido) {
    return res.status(400).json("O telefone já existe");
  }

  const contato = {
    id: idGerado,
    usuario_id: usuario.id,
    nome,
    email,
    telefone,
  };

  contatos.push(contato);

  fs.writeFile(
    path.join(__dirname, "..", "Dados", "kontacts_contatos.json"),
    JSON.stringify(contatos),
    (err) => {
      if (err) return;
    }
  );

  return res.status(200).json("O Contato foi cadastrado com sucesso.");
};

const atualizarContato = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  const { nome, telefone, email } = req.body;

  if (!nome && !telefone && !email) {
    return res
      .status(404)
      .json("Informe ao menos um campo para atualizaçao do contato");
  }

  const encontrarContato = contatos.find(
    (item) => String(item.id) === id && item.usuario_id === usuario.id
  );

  if (!encontrarContato) {
    return res.status(404).json("Contato não encontrado");
  }

  if (email) {
    if (email !== encontrarContato.email) {
      const emailRepetido = contatos.find((item) => item.email === email);

      if (emailRepetido) {
        return res.status(400).json("O email já existe");
      }
    }
  }

  if (telefone) {
    if (telefone !== encontrarContato.telefone) {
      const telefoneRepetido = contatos.find(
        (item) => item.telefone === telefone
      );

      if (telefoneRepetido) {
        return res.status(400).json("O telefone já existe");
      }
    }
  }

  encontrarContato.nome = nome;
  encontrarContato.telefone = telefone;
  encontrarContato.email = email;

  return res.status(200).json("Contato foi atualizado com sucesso.");
};

const excluirContato = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  const encontrarContato = contatos.find(
    (item) => String(item.id) === id && item.usuario_id === usuario.id
  );

  if (!encontrarContato) {
    return res.status(404).json("Contato não encontrado");
  }

  const contatoEncontrado = contatos.indexOf(encontrarContato);

  contatos.splice(contatoEncontrado, 1);

  return res.status(200).json("Contato excluido com sucesso");
};

module.exports = {
  listarContatos,
  obterContato,
  cadastrarContato,
  atualizarContato,
  excluirContato,
};

const jwt = require("jsonwebtoken");
const senhaHash = require("../senhaHash");
const usuarios = require("../Dados/kontacts_usuarios.json");

const verificaLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Não autorizado");
  }

  try {
    const token = authorization.replace("Bearer ", "").trim();

    const { id } = jwt.verify(token, senhaHash);

    const usuarioEncontrado = usuarios.find((item) => item.id === id);

    if (!usuarioEncontrado) {
      return res.status(400).json("O usuário não foi encontrado");
    }

    const { senha, ...usuario } = usuarioEncontrado;

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = verificaLogin;

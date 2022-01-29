const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaHash = require("../senhaHash");
const usuarios = require("../Dados/kontacts_usuarios.json");

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(404).json("É obrigatório email e senha");
  }

  try {
    const emailExiste = usuarios.find((item) => item.email === email);

    if (!emailExiste) {
      return res
        .status(400)
        .json("Não existe neste app um usuário com este email");
    }

    const usuario = emailExiste;

    console.log(usuario);

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json("Combinação de e-mail e senha incorreta");
    }

    const token = jwt.sign({ id: usuario.id }, senhaHash, { expiresIn: "8h" });

    const { senha: _, ...dadosUsuario } = usuario;

    return res.status(200).json({
      usuario: dadosUsuario,
      token,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  login,
};

var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const Users = require('../models/users')
const jwt = require('jsonwebtoken')

router.post('/', async function(req, res, next) {
  try {
    const newUser = new Users({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      emoji: req.body.emoji,
    })
    await newUser.save()
    return res.status(201).json("Novo usuario criado com sucesso!")
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: "Novo usuario não pode ser criado!",
      error
    })
  }
});

router.post('/authenticate', async function(req, res, next) {
  try {
    const user = await Users.findOne({
      username: req.body.username
    })
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).json({ msg: "Não foi possivel autenticar o usuário com os dados informados!" })
    }
    const token = jwt.sign({
      username: user.username

    }, 'HASH_QUALQUER')
    
    return res.status(200).json({
      msg: "Usuario autenticado com sucesso!",
      token,
      username: user.username,
      emoji: user.emoji
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: "Erro ao tentar autenticar!",
      error
    })
  }
});

module.exports = router;

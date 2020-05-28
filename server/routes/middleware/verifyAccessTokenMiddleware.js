const Users = require('../../models/users')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {

    if (!req.headers['authorization']) {
      return res.status(400).json({ msg: "Access token não informado!" })
    }

    const token = req.headers['authorization'].split(' ')
    
    if (token[0] !== 'Bearer') {
      return res.status(400).json({ msg: "Access token informado mas inválido!" })
    }

    const user = await jwt.verify(token[1], 'HASH_QUALQUER')
    req.body.user = await Users.findOne({username: user.username})

    next()

  } catch (error) {
    return res.status(400).json({ msg: "Não foi possivel validar o token" })
  }

}
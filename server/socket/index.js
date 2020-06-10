const jwt = require('jsonwebtoken')
const userRepository = require('../models/usersRepository')

const extractJWT = async (socket) => {
    const token = socket.request._query['token']
    const user = await jwt.verify(token, 'STRING_CRIPTOGRAFADA')
    return user.username
}

module.exports = async (socket) => {
  try {
    const username = await extractJWT(socket)
    const user = await userRepository.findByUsername(username)
    user.socketId = socket.id
    await user.save()

    let users = await userRepository.findOnlineUsers()

    socket.broadcast.emit('onlineUsers', users)
    socket.emit('onlineUsers', users)
    console.log(`${user.username} conectado!!`)
  } catch (error) {
      console.log(error)
  }

  socket.on('disconnect', async() => {
    try {
        const user = await userRepository.findBySocketId(socket.id)
        user.socketId = null
        await user.save()

        let users = await userRepository.findOnlineUsers()
        socket.broadcast.emit('onlineUsers', users)
        socket.emit('onlineUsers', users)
        console.log(`${user.username} desconectado!!`)
    } catch (error) {
        console.log(error)
    }
})

}
import io from 'socket.io-client'

export default {
  socket: null,
  usersObservers: [], 
  messagesObservers: [],
  users: [],
  addUsersObserver(callback) {
    this.usersObservers.push(callback)
  },
  
  async init(token) {
    this.socket = io.connect('http://localhost:3000/', {
      query: `token=${token}`
    })
    this.socket.on('onlineUsers', (users) => {
      this.users = users.filter (user => user.username != localStorage.username)
      this.usersObservers.forEach(callback => callback(this.users))
    })
  }

}
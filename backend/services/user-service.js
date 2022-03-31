const User = require("../models/user-model")

class UserService {
  async findUser(filter) {
    const user = await User.findOne(filter)
    if (!user) {
      return null
    }
    return user
  }
  async createUser(data) {
    const newUser = await User.create(data)
    return newUser
  }
}

module.exports = new UserService()

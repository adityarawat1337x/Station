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
  async updateUser(id, user) {
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    })
    return updatedUser
  }
  async deleteUser(id) {
    const deletedUser = await User.findByIdAndDelete(id)
    return deletedUser
  }
}

module.exports = new UserService()

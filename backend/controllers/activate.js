const Jimp = require("jimp")
const UserDtos = require("../dtos/user-dtos")
const UserService = require("../services/user-service")
const path = require("path")

class ActivateController {
  async activate(req, res) {
    const { name, avatar } = req.body

    if (!name || !avatar)
      return res.status(400).send({ message: "Please provide name and avatar" })

    const imagePath = `${Date.now()}.png`
    try {
      const buffer = Buffer.from(
        avatar.replace(/^data:image\/(png|jpeg|jpg);base64,/, ""),
        "base64"
      )
      const jimpRes = await Jimp.read(buffer)
      jimpRes
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/${imagePath}`))
    } catch (err) {
      return res
        .status(500)
        .send({ error: err, message: "Image Processing error" })
    }

    try {
      const userId = req.user._id
      const user = await UserService.findUser({ id: userId })
      if (!user)
        return res.status(404).send({ error: err, message: "User not found" })
      user.name = name
      user.activated = true
      user.avatar = `/storage/${imagePath}`
      user.save()
      console.log("activated")
      res.json({ user: new UserDtos(user), auth: true })
    } catch (err) {
      return res
        .status(500)
        .send({ error: err, message: "Error activating user" })
    }
  }
}

module.exports = new ActivateController()

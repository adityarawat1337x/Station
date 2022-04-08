const RoomDto = require("../dtos/room-dtos")
const RoomService = require("../services/room-service")

class RoomController {
  async create(req, res) {
    const { topic, roomType } = req.body
    if (!topic || !roomType)
      return res.status(400).json({
        message: "Topic and roomType are required",
      })

    const room = await RoomService.create({
      topic,
      roomType,
      ownerId: req.user._id,
    })

    return res.status(201).json({
      message: "Room created successfully",
      room: new RoomDto(room),
    })
  }
  async getAll(req, res) {
    const rooms = await RoomService.getAll({ roomType: "open" })

    return res.status(201).json({
      rooms: rooms.map((room) => new RoomDto(room)),
    })
  }
}

module.exports = new RoomController()

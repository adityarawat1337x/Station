const RoomModel = require("../models/room-model")

class RoomService {
  async create(payload) {
    const { topic, roomType, ownerId } = payload
    const room = await RoomModel.create({
      topic,
      roomType,
      ownerId,
      speakers: [ownerId],
    })

    return room
  }

  async getAll(filter) {
    const rooms = await RoomModel.find(filter)
      .populate("speakers")
      .populate("ownerId")
      .exec()
    return rooms
  }

  async getRoom(id) {
    const room = await RoomModel.findById(id)
      .populate("speakers")
      .populate("ownerId")
      .exec()
    return room
  }
}

module.exports = new RoomService()

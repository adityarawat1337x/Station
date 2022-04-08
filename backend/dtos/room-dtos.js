class RoomDto {
  _id
  topic
  ownerId
  roomType
  speakers

  constructor(room) {
    this._id = room._id
    this.topic = room.topic
    this.ownerId = room.ownerId
    this.roomType = room.roomType
    this.speakers = room.speakers
  }
}

module.exports = RoomDto

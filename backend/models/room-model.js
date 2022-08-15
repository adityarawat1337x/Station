const mongoose = require("mongoose")

const schema = mongoose.Schema

const roomSchema = new schema(
  {
    topic: { type: String, required: true },
    roomType: { type: String, default: "open", required: true },
    ownerId: {
      type: schema.Types.ObjectId,
      ref: "User",
    },
    speakers: {
      type: [{ type: schema.Types.ObjectId, ref: "User" }],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Room", roomSchema, "rooms")

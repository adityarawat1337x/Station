const mongoose = require("mongoose")

const schema = mongoose.Schema

const refreshSchema = new schema(
  {
    userId: { type: schema.Types.ObjectId, ref: "User" },
    token: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Refresh", refreshSchema, "tokens")

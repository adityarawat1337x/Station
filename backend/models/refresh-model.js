const mongoose = require("mongoose")

const schema = mongoose.Schema

const refreshSchema = new schema(
  {
    token: { type: String, required: true, unique: true },
    user_id: { type: schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Refresh", refreshSchema, "tokens")

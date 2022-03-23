const mongoose = require("mongoose")

const schema = mongoose.Schema

const userSchema = new schema(
  {
    phone: { type: String, required: true, unique: true },
    activated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("User", userSchema, "user")

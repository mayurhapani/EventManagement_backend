const mongoose = require("mongoose");

const registerEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    ticketCount: {
      type: Number,
      required: true,
      min: 1,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "POST",
      required: true,
    },
    status: {
      type: String, // Storing the event type
      required: true,
      enum: ["yes", "no", "maybe"],
    },
  },
  {
    timestamps: true,
  }
);

const registerEventModel = mongoose.model("REGISTER", registerEventSchema);

module.exports = registerEventModel;

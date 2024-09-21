const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    disc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Minimum price is 0
    },
    image: {
      type: String,
      required: true,
    },
    image_Id: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
    eventStartDate: {
      type: Date,
      required: true,
    },
    eventEndDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "Conference",
        "Workshop",
        "Concert",
        "Workshop",
        "Seminar",
        "Meetup",
        "Festival",
        "Party",
      ],
    },
    attendees: {
      type: Number,
      required: true,
      min: 1,
    },
    registeredUser: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
      },
    ],
    comments: [
      {
        comment: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "USER",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.model("POST", postSchema);

module.exports = postModel;

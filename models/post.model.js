const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  disc: {
    type: String,
    required: true,
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
  eventDate: {
    type: Date, // Storing the event date
    required: true,
  },
  location: {
    type: String, // Storing the event location
    required: true,
  },
  eventType: {
    type: String, // Storing the event type
    required: true,
    enum: ["Conference", "Workshop", "Meetup", "Webinar"], // Add your own event types here
  },
  attendees: {
    type: Number, // Storing the max number of attendees
    required: true,
    min: 1, // Ensure there's at least 1 attendee
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
});

const postModel = mongoose.model("POST", postSchema);

module.exports = postModel;

const postModel = require("../models/post.model");
const registerEventModel = require("../models/registerEvent.model");
const { extractPublicId, deleteImageByUrl } = require("../public/javascripts/image_functions");

const getPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find({})
      .populate("user", "username image")
      .populate("comments.user", "username");
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel
      .findById(id)
      .populate("user", "username image")
      .populate("comments.user", "username");

    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  const {
    title,
    disc,
    image,
    price,
    eventStartDate,
    eventEndDate,
    location,
    eventType,
    attendees,
  } = req.body;
  const image_Id = extractPublicId(image);

  try {
    // Validate that all fields are present
    if (
      !title ||
      !image ||
      !disc ||
      !price ||
      !eventStartDate ||
      !eventEndDate ||
      !location ||
      !eventType ||
      !attendees
    ) {
      return res.status(422).json({ message: "Fill all the inputs" });
    }

    const user = req.user._id;

    // Create the post with the additional event-related fields
    const response = await postModel.create({
      title,
      disc,
      image,
      user,
      price,
      image_Id,
      eventStartDate,
      eventEndDate,
      location,
      eventType,
      attendees,
    });

    if (response) {
      return res.status(201).json({ message: "Event Created Successfully" });
    } else {
      return res.status(422).json({ message: response.message });
    }
  } catch (error) {
    if (image_Id) await deleteImageByUrl(`posts/${image_Id}`, res);
    return res.status(500).json({ message: error.message });
  }
};

const editPost = async (req, res) => {
  const {
    postId,
    title,
    disc,
    image,
    price,
    eventStartDate,
    eventEndDate,
    location,
    eventType,
    attendees,
  } = req.body;

  const image_Id = extractPublicId(image);
  const user = req.user._id;

  try {
    // Validate that all fields are present
    if (
      !postId ||
      !title ||
      !image ||
      !disc ||
      !price ||
      !eventStartDate ||
      !eventEndDate ||
      !location ||
      !eventType ||
      !attendees
    ) {
      return res.status(422).json({ message: "Fill all the inputs" });
    }

    // Create the post with the additional event-related fields
    const response = await postModel.findByIdAndUpdate(postId, {
      title,
      disc,
      image,
      user,
      price,
      image_Id,
      eventStartDate,
      eventEndDate,
      location,
      eventType,
      attendees,
    });

    if (response) {
      return res.status(201).json({ message: "Event Edited Successfully" });
    } else {
      return res.status(422).json({ message: response.message });
    }
  } catch (error) {
    if (image_Id) await deleteImageByUrl(`posts/${image_Id}`, res);
    return res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id).populate("user", "_id");

    if (!post) return res.status(404).json({ message: "Event not found" });
    const publicId = post.image_Id;

    if (req.user._id.toString() != post.user._id.toString())
      return res.status(404).json({ message: "User Not Authorized" });

    // Delete post and image
    await postModel.findByIdAndDelete(id);
    await deleteImageByUrl(`posts/${publicId}`, res);

    return res.status(200).json({ message: "Event and image deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findOne({ _id: req.params.id });

    if (post.likes.indexOf(req.user._id) === -1) {
      post.likes.push(req.user._id);
      await post.save();
      return res.status(200).json({ Like: true, message: "Liked" });
    } else {
      post.likes.splice(post.likes.indexOf(req.user._id), 1);
      await post.save();
      return res.status(200).json({ Like: false, message: "Unlike" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    post.comments.push({ user: req.user._id, comment: req.body.comment });
    await post.save();

    return res.status(200).json({ message: "Comment Done" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId, postId } = req.query;
    const post = await postModel.findById(postId);

    if (!post) return res.status(404).json({ message: "Event not found" });

    // Filter
    post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const myFollowing = async (req, res) => {
  try {
    const followingPosts = await postModel
      .find({ user: { $in: req.user.following } })
      .populate("user");
    return res.status(200).json({ followingPosts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const registerEvent = async (req, res) => {
  try {
    const { post, name, email, mobile, status, ticketCount } = req.body;
    const user = req.user._id;

    // Validate that all fields are present
    if (!post || !name || !email || !mobile || !status || !ticketCount) {
      return res.status(422).json({ message: "Fill all the inputs" });
    }

    // Create the post with the additional event-related fields
    const response = await registerEventModel.create({
      post,
      user: user._id,
      name,
      email,
      mobile,
      status,
      ticketCount,
    });

    if (response) {
      return res.status(201).json({ message: "Registration In Event Successfully" });
    } else {
      return res.status(422).json({ message: response.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  editPost,
  deletePost,
  getPosts,
  getMyPost,
  likePost,
  addComment,
  deleteComment,
  myFollowing,
  registerEvent,
};

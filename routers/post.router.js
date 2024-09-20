const { Router } = require("express");
const { isAuth } = require("../middlewares/isAuth.middleware");
const pRouter = Router();
const {
  getPosts,
  getMyPost,
  createPost,
  editPost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
  myFollowing,
  registerEvent,
} = require("../controllers/post.controller");

pRouter.get("/getPosts", isAuth, getPosts);
pRouter.get("/getMyPosts/:id", isAuth, getMyPost);

pRouter.get("/myFollowing", isAuth, myFollowing);

pRouter.post("/createPost", isAuth, createPost);
pRouter.patch("/editPost", isAuth, editPost);
pRouter.delete("/deletePost/:id", isAuth, deletePost);

pRouter.post("/registerEvent", isAuth, registerEvent);

pRouter.get("/like/:id", isAuth, likePost);
pRouter.post("/addComment/:id", isAuth, addComment);
pRouter.delete("/deleteComment", isAuth, deleteComment);

module.exports = pRouter;

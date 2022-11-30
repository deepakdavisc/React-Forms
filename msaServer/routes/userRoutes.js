const express = require("express");

const router = express.Router();

const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  authUser,
  geCurrentUser,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getUser).post(createUser);

router.route("/login").post(authUser);

// router.route("/me").get(geCurrentUser);

router.route("/:id").put(updateUser).delete(deleteUser);

router.get("/me", protect, geCurrentUser);

// router.post("/", createUser);

// router.put("/:id", updateUser);

// router.delete("/:id", deleteUser);

module.exports = router;

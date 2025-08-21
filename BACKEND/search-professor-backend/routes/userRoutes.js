var express = require("express");

const {
  createUserController,
  getUserController,
  loginHandleController,
  getUserListController,
  getProfileController,
  updateProfileController,
} = require("../controller/userController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res) {
  res.json({
    message: "User Controller is working",
  });
});
router.post("/create", createUserController);
router.post("/login", loginHandleController);
router.get("/list", validateTokenMiddleware, getUserListController);
router.get("/profile", validateTokenMiddleware, getProfileController);
router.put("/profile", validateTokenMiddleware, updateProfileController);

module.exports = router;

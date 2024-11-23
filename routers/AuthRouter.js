const express = require("express");
const { AuthRegister, AuthLogin, getUsers, getUserById, editUser, deleteUser } = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/register", AuthRegister);
router.post("/login", AuthLogin);

router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.put("/users/:id", verifyToken, editUser);
router.delete("/users/:id", verifyToken, deleteUser);

module.exports = router;

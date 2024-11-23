const bcrypt = require("bcryptjs");
const Account = require("../models/UserModel");
const jsonwebtoken = require("jsonwebtoken");

const AuthRegister = async (req, res) => {
  const { email, password, username, isAdmin } = req.body;

  try {
    const passwordEncrypted = bcrypt.hashSync(password, 10);

    const userExists = await Account.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new Account({
      email,
      password: passwordEncrypted,
      username,
      isAdmin: isAdmin || false,
    });

    const newUser = await user.save();
    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const AuthLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Account.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }

    const payload = {
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };

    jsonwebtoken.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          message: "Login successful",
          token,
          data: user,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await Account.find();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const editUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, isAdmin } = req.body;

  try {

    const user = await Account.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Account.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    await Account.deleteOne({ _id: id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Account.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};
module.exports = { AuthRegister, AuthLogin, getUsers, editUser, deleteUser, getUserById };

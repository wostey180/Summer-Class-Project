const User = require("../model/userModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

async function createUserController(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All Fields are required",
    });
  }

  const checkUser = await User.findOne({ email });
  if (checkUser) {
    return res.status(400).json({
      message: "User with this email already exists",
    });
  }

  const encryptPassword = await bcrypt.hash(password, 10);

  const data = {
    name,
    email,
    password: encryptPassword,
  };

  const user = new User(data);
  await user.save();
  res.status(201).json({
    message: "User Created",
    user: user,
  });
}

async function loginHandleController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All Fields are required",
    });
  }

  const checkUser = await User.findOne({ email }).select("+password");
  if (!checkUser) {
    return res.status(400).json({
      message: "User with this email does not exist",
    });
  }

  const comparePassword = await bcrypt.compare(password, checkUser.password);
  if (comparePassword) {
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
      },
      "c2VjdXJlS2V5X0pXVF8yMDI1XzEyMzQ1Njc4OTBhYmNkZWY=",

      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      accessToken: token,
    });
  } else {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }
}

async function getUserListController(req, res) {
  const userList = await User.find();

  res.status(200).json({
    message: "User List",
    users: userList,
  });
}

async function getProfileController(req, res) {
  try {
    const userId = req.user.id; // This comes from the auth middleware
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message
    });
  }
}

async function updateProfileController(req, res) {
  try {
    const userId = req.user.id;
    const { name, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          message: "Current password is incorrect"
        });
      }

      // Hash and set new password
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating profile",
      error: error.message
    });
  }
}

module.exports = {
  createUserController,
  loginHandleController,
  getUserListController,
  getProfileController,
  updateProfileController,
};

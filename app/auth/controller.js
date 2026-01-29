const { User } = require("./model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res, next) => {
  try {
    let userData = req.body;
    let { userName, emailId, password, confirmPassword } = userData;

    let user = await User.findOne({ emailId });

    if (user) {
      return res
        .status(400)
        .send({ success: false, msg: "User already registered." });
    }

    if (!confirmPassword) {
      return res
        .status(400)
        .send({ success: false, msg: "Please enter a password" });
    }

    if (!password) {
      return res
        .status(400)
        .send({ success: false, msg: "Please enter a confirm password" });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({
        success: false,
        msg: "Password and Confirm password are different.",
      });
    }

    const salt = await bcrypt.genSalt(10);

    let newUser = new User({
      userName: userName,
      emailId: emailId,
      role: "user",
    });

    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();

    return res.status(200).json({
      success: true,
      msg: "User registered successfully",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        emailId: newUser.emailId,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let { page, limit, search, filterObj } = req.query;
    let skip = (page - 1) * limit;

    let query = {};
    const textSearchConditions = [
      { name: { $regex: search, $options: "i" } },
      { emailId: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
      { treatment: { $regex: search, $options: "i" } },
      { mhidCode: { $regex: search, $options: "i" } },
      { passportNumber: { $regex: search, $options: "i" } },
    ];
    const finalQuery = {
      $and: [query, { $or: textSearchConditions }],
    };

    let user = await User.find(finalQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      msg: "Users found successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    let user = await User.findOne({
      _id: userId,
    });

    if (!user?._id) {
      return res.status(400).send({ success: false, msg: "User not found." });
    }

    return res.status(200).json({
      success: true,
      msg: "User found successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.setUserActive = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    let data = req.body;
    let user = await User.findOne({
      _id: userId,
    });

    if (!user?._id) {
      return res.status(400).send({ success: false, msg: "User not found." });
    }

    user.isActive = data?.isActive;

    let message = "";
    if (data?.isActive === true) {
      message = "User activated successfully";
    } else {
      message = "User deactivated successfully";
    }

    await user.save();

    return res.status(200).json({
      success: true,
      msg: message,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    let data = req.body;
    let user = await User.findOne({
      _id: userId,
    });

    if (!user?._id) {
      return res.status(400).send({ success: false, msg: "User not found." });
    }

    const comparePassword = await bcrypt.compare(
      data.oldPassword,
      user.password,
    );
    if (comparePassword) {
      if (data.newPassword !== data.confirmPassword) {
        return res
          .status(400)
          .send({ success: false, msg: "Password must be same" });
      }
      if (data.newPassword === data.oldPassword) {
        return res
          .status(400)
          .send({ success: false, msg: "Please enter different password." });
      }

      const hash = await bcrypt.hash(data.newPassword, 10);
      user.password = hash;
      await user.save();

      return res.status(200).json({
        success: true,
        msg: "Password updated successfully",
      });
    } else {
      return res.status(400).send({
        success: false,
        msg: "Please enter the correct old password.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    let user = await User.findOne({
      _id: userId,
    });

    if (!user?._id) {
      return res.status(400).send({ success: false, msg: "User not found." });
    }

    await User.findByIdAndDelete(userId);
    return res
      .status(300)
      .send({ success: false, msg: "User deleted successsfully." });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    let data = req.body;
    const { emailId, password } = data;

    if (!emailId || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password are required",
      });
    }

    let findedUser = await User.findOne({
      emailId,
    });

    if (!findedUser?._id) {
      return res.status(400).send({ success: false, msg: "User not found." });
    }

    if (!findedUser.isActive) {
      return res.status(403).json({
        success: false,
        msg: "Account is disabled",
      });
    }

    const comparePassword = await bcrypt.compare(password, findedUser.password);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    let tokenPayload = {
      id: findedUser._id,
      role: findedUser.role,
      userName: findedUser.userName,
      emailId: findedUser.emailId,
      isActive: findedUser.isActive,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    findedUser.lastLogin = new Date();
    await findedUser.save();

    return res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      user: tokenPayload,
    });
  } catch (error) {
    console.log(error);
  }
};

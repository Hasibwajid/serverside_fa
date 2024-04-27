import User from "../Models/userModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, role, address, phone, city } = req.body;

    // Validations
    if (!name) {
      return res.status(400).send({ error: "Name is required" });
    }
    if (!email) {
      return res.status(400).send({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({ error: "Password is required" });
    }
    if (!role) {
      return res.status(400).send({ error: "Role is required" });
    }
    if (!phone) {
      return res.status(400).send({ error: "Phone number is required" });
    }
    if (!address) {
      return res.status(400).send({ error: "Address is required" });
    }
    if (!city) {
      return res.status(400).send({ error: "city is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await new User({
      name,
      email,
      password: hashedPassword,
      role,
      address,
      phone,
      city,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

// login

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password ",
      });
    }

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    // compare password with encrypted password in db
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    // create token
    const token = await Jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        id : user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role : user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in login",
      err,
    });
  }
};

// RESET PASSWORD

export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validation
    if (!email) {
      return res.status(400).send({ error: "Email is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ error: "New password is required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .send({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error resetting password", error });
  }
};

// test
export const testController = (req, res) => {
  try {
    res.send("protected route");
  } catch (err) {
    console.log(err);
    res.send({ err });
  }
};

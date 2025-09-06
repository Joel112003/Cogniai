import User from "../models/auth.model.js";
import { createSecretToken } from "../utils/SecretToken.js";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'All fields are required',
        success: false 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Incorrect password or email',
        success: false 
      });
    }

    // Use model method for password comparison
    const auth = await user.comparePassword(password);
    if (!auth) {
      return res.status(401).json({ 
        message: 'Incorrect password or email',
        success: false 
      });
    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({ 
      message: "User logged in successfully", 
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      success: false 
    });
  }
};

export const Signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ 
        message: "All fields are required",
        success: false 
      });
    }

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        message: existingUser.email === email ? "Email already exists" : "Username already exists",
        success: false 
      });
    }

    const user = await User.create({ email, password, username }); // createdAt defaults in schema

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({ 
      message: "User signed up successfully", 
      success: true, 
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        success: false
      });
    }

    res.status(500).json({ 
      message: "Internal server error",
      success: false 
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

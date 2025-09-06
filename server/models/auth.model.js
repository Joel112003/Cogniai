import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Make sure this is bcryptjs

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  createdAt: {
    type: Date,
    default: Date.now  // Use Date.now instead of new Date()
  },
});

// CRITICAL FIX: Only hash password if it's been modified
userSchema.pre("save", async function (next) {
  // If password hasn't been modified, skip hashing
  if (!this.isModified("password")) {
    return next();
  }
  
  try {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON responses so that the password doesn't get exposed or leak by the api
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model("User", userSchema);
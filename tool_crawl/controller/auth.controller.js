const User = require("../models/User");

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Login a user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

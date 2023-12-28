const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyValue) {
      // Duplicate key error (E11000)
      const duplicateField = Object.keys(err.keyPattern)[0];
      const duplicateValue = err.keyValue[duplicateField];
      res.status(400).json({
        error: `Duplicate key error: ${duplicateField} '${duplicateValue}' already exists.`,
      });
    } else {
      // Other errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const login = async (req, res) => {
  //checking if user exists in the database
  const user = await User.findOne({ username: req.body.username });
  !user && res.status(404).json({ message: "user not found" });

  const accessToken = jwt.sign(
    {
      user,
    },
    process.env.JWT_KEY
  );

  const { password, ...others } = user._doc;

  try {
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(401).json("not otherized");
  }
};

const update = async (req, res) => {
  const id = req.params.id;
  await User.findByIdAndUpdate(id, { $set: req.body });
  try {
    res.status(200).json("updated");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  try {
    res.status(200).json("deleted");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, update, deletUser };

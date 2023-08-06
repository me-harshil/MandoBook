require("dotenv-extended").load();
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = "myjwtsecurepass";

// Route 1: Create a user using: POST "/api/auth/createuser". Doesn't require Auth
router.post(
  "/createuser",
  [
    // Check if name, email, password is not empty and add constraints
    body("name").notEmpty().isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Check errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }

    try {
      // Check if user exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email already exists" });
      }
      // making password secure
      const salt = await bcrypt.genSalt(10);
      let securePass = await bcrypt.hash(req.body.password, salt);
      // Create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });
      // Create token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      return res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// Route 2: Authenticate a user using: POST "/api/auth/login".
router.post(
  "/login",
  [
    // Check if email, password is not empty and add constraints
    body("email", "Enter valid email").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
    // Check errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      // Check password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      return res.json({ authToken });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Get loggedin user details using: POST "/api/auth/getuser". Login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.send(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = router;

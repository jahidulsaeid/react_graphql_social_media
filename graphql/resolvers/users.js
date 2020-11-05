const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmpassword } },
      context,
      info
    ) {
      //TODO: Validation user data
      //TODO: Make sure doesnt already exist
      //TODO: hash pass and create auto token
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();

      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};

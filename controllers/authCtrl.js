const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config();
const { SECRET_KEY } = process.env;
const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../models/user');
const fs = require("fs/promises")
const gravatar = require('gravatar');
const path = require("path");
const jimp = require("jimp");

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { email, password }  = req.body;
    const user = await User.findOne({ email }); 
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarUrl });
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
     });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, {token})

     res.json({
       token,
       user: {
         email: user.email,
         subscription: user.subscription,
       },
     });
}

const getCurrentUser = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    }); 
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).send();
}
const updateAvatar = async (req, res) => { 
    const { _id } = req.user;
    const { path: tmpUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`
    const pathUpload = path.join(avatarDir, filename);
    // await fs.rename(tmpUpload, pathUpload);

    const image = await jimp.read(tmpUpload);
    await image.resize(250, 250).write(pathUpload);

    const avatarUrl = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarUrl });

    res.json({
        avatarUrl,
    })
}
module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
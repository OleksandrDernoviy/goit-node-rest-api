const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config();
const { SECRET_KEY, BASE_URL } = process.env;
const { HttpError, ctrlWrapper, sendEmail } = require('../helpers');
const { User } = require('../models/user');
const fs = require("fs/promises")
const gravatar = require('gravatar');
const path = require("path");
const jimp = require("jimp");
const { nanoid } = require("nanoid");

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 
    if (user) {
        throw HttpError(409, "Email in use");
    }
    const verificationToken = nanoid();
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarUrl, verificationToken });
    
const verifyEmail = {
  to: email,
  subject: "Verify email",
  html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
};
await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
     });
}

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verify");
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
    if (!req.file) {
        throw HttpError(400, "No file attached. Please attach a file.");
    }
    const { path: tmpUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`
    const pathUpload = path.join(avatarDir, filename);

    const image = await jimp.read(tmpUpload);
    await image.resize(250, 250).writeAsync(pathUpload);
    await fs.unlink(tmpUpload);

    const avatarUrl = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarUrl });

    res.json({
        avatarUrl,
    })
}
module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  login: ctrlWrapper(login),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};



const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
    avatarUrl: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },

  { versionKey: false }
);

userSchema.post("save", handleMongooseError)

const registerSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  subscription: Joi.string(),
}).messages({
  "any.required": "missing required field email",
  "string.pattern.base": "Invalid email format",
});


const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
}).messages({
  "any.required": "missing required field email",
  "string.pattern.base": "Invalid email format",
});


const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
}).messages({
  "any.required": "missing required field email",
  "string.pattern.base": "Invalid email format",
});

const User = model("user", userSchema);

module.exports = {
  registerSchema,
  emailSchema,
  loginSchema,
  User,
};
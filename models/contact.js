const { Schema, model } = require("mongoose");
const handleMongooseError = require("../helpers/handleMongooseError");
const Joi = require("joi");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);
contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

const createContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Set name for contact",
    "string.empty": "Set name for contact",
  }),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[\d() -]+$/)
    .required(),
  favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[\d() -]+$/),
  favorite: Joi.boolean(),
})
  .min(1)
  .message("Body must have at least one field");

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
  Contact,
};

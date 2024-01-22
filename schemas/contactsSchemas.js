
const Joi = require("joi");

const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email()
    .message("Invalid email format").required(),
  phone: Joi.string()
    .pattern(/^[\d() -]+$/)
    .message("Phone must contain only numbers")
    .required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().message("Invalid email format"),
  phone: Joi.string()
    .pattern(/^[\d() -]+$/)
    .message("Phone must contain only numbers"),
})
  .min(1)
  .message("Body must have at least one field");
  

module.exports = {
  createContactSchema,
  updateContactSchema,
};




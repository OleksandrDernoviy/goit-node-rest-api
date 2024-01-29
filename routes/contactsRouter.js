const express = require("express");
const contactsControllers = require("../controllers/contactsControllers");
const validateBody = require("../middlewares/validateBody");
const isValidId = require("../middlewares/isValidId");
const schemas = require("../models/contact");
const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getContactById);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.post(
  "/",
  validateBody(schemas.createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(schemas.updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  contactsControllers.updateStatusContact
);

module.exports = contactsRouter;

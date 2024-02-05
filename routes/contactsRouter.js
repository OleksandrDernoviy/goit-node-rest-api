const express = require("express");
const contactsCtrl = require("../controllers/contactsController");
const { validateBody, isValidId, authenticate } = require("../middlewares");

const schemas = require("../models/contact");
const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, contactsCtrl.getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, contactsCtrl.getContactById);

contactsRouter.delete("/:id", authenticate, isValidId, contactsCtrl.deleteContact);

contactsRouter.post(
  "/", authenticate,
  validateBody(schemas.createContactSchema),
  contactsCtrl.createContact
);

contactsRouter.put(
  "/:id", authenticate,
  isValidId,
  validateBody(schemas.updateContactSchema),
  contactsCtrl.updateContact
);

contactsRouter.patch(
  "/:id/favorite", authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  contactsCtrl.updateStatusContact
);

module.exports = contactsRouter;

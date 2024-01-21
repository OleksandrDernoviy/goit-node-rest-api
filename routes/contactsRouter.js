
const express = require("express");
const  contactsControllers  = require("../controllers/contactsControllers");
const  validateBody   = require('../helpers/validateBody')
const schemas = require('../schemas/contactsSchemas')
const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", contactsControllers.getContactById);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.post("/", validateBody(schemas.createContactSchema), contactsControllers.createContact);

contactsRouter.put("/:id", validateBody(schemas.updateContactSchema), contactsControllers.updateContact);

module.exports = contactsRouter;

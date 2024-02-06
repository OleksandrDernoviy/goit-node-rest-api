
const contactsService = require("../services/contactsServices");
const { HttpError, ctrlWrapper } = require("../helpers/index");
const { Contact } = require("../models/contact");

const getAllContacts = async (req, res, next) => {
    const { _id: owner } = req.user;
    const contacts = await contactsService.listContacts(owner);
    res.json(contacts);

};

const getContactById = async (req, res, next) => {  
    const { id } = req.params;
    const { _id: owner } = req.user;
    const contact = await contactsService.getContactById(id, owner);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.json(contact);
};

const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.removeContact(id, owner);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "Delete success" });
  
};

const createContact = async (req, res, next) => { 
    const { _id: owner } = req.user;
    const newContact = await contactsService.addContact(req.body, owner);
    res.status(201).json(newContact);
 
};

const updateContact = async (req, res, next) => { 
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.updateContact(id, req.body, owner);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
 
};

const updateStatusContact = async (req, res, next) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.updateStatusContact(id, req.body, owner);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
 
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
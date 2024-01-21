const  contactsService  = require("../services/contactsServices.js");
const HttpError = require('../helpers/HttpError');
const wrap = require('../helpers/ctrlWrapper');

const getAllContacts = async (req, res) => {
    const contacts = await contactsService.listContacts();
    res.json(contacts);
};


const getContactById = async (req, res) => {
    const { id } = req.params
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
    res.json(result)
}
 

const deleteContact = async (req, res) => {
  const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json({
        message: "Delete success"
    })
};


const createContact = async (req, res) => {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result) 
};


const updateContact = async(req, res) => {
     const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json(result);
};


module.exports = {
  getAllContacts: wrap(getAllContacts),
  getContactById: wrap(getContactById),
  deleteContact: wrap(deleteContact),
  createContact: wrap(createContact),
  updateContact: wrap(updateContact),
};
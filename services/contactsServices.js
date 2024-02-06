
const { Contact } = require("../models/contact.js");

const listContacts = async (owner) => {
  return await Contact.find({ owner }).populate("owner", "email subscription");
};

const getContactById = async (id, owner) => {
  return await Contact.findOne({ _id: id, owner });
};

const removeContact = async (id, owner) => {
  return await Contact.findOneAndDelete({ _id: id, owner });
};

const addContact = async (data, owner) => {
  return await Contact.create({ ...data, owner });
};

const updateContact = async (id, data, owner) => {
  return await Contact.findOneAndUpdate({ _id: id, owner }, data, {
    new: true,
  });
};

const updateStatusContact = async (id, status, owner) => {
  return await Contact.findOneAndUpdate(
    { _id: id, owner },
    { status },
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};



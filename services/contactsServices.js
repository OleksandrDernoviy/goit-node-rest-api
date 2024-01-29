const { Contact } = require("../models/contact");

const listContacts = () => Contact.find();

const getContactById = async (id) => Contact.findById(id);

const removeContact = async (contactId) => {
  const deleteContact = await Contact.findByIdAndDelete(contactId);
  return deleteContact;
};

const addContact = async (data) => {
  const newContact = await Contact.create(data);
  return newContact;
};

const updateContact = async (id, data) => {
  const upContact = await Contact.findByIdAndUpdate(id, data, {
    new: true,
  });
  return upContact;
  
};

const updateStatusContact = async (id, data) => {
  const upStatContact = await Contact.findByIdAndUpdate(id, data, {
    new: true,
  });
  return upStatContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

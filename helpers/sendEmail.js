
const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_LINK_FROM, META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: META_LINK_FROM,
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
  const email = { ...data, from: META_LINK_FROM };
  return transport.sendMail(email);
};

module.exports = sendEmail;
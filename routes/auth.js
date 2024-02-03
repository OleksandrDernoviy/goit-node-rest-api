const express = require('express');
const router = express.Router();
const validateBody = require("../middlewares/validateBody");
const schemas = require("../models/user");
const auth = require("../controllers/auth");

router.post("/register", validateBody(schemas.registerSchema), auth.register);
router.post("/login", validateBody(schemas.loginSchema), auth.login)

module.exports = router;
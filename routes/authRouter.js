const express = require('express');
const router = express.Router();
const { validateBody, authenticate, upload } = require('../middlewares')
const schemas = require("../models/user");
const auth = require("../controllers/authCtrl");

router.post("/register", validateBody(schemas.registerSchema), auth.register);
router.post("/login", validateBody(schemas.loginSchema), auth.login);
router.get("/current", authenticate, auth.getCurrentUser);
router.post("/logout", authenticate, auth.logout);
router.patch("/avatars", authenticate, upload.single("avatar"), auth.updateAvatar);

module.exports = router;
const express = require("express");

// internal imports
const { getUsers, 
    addUser,
    removeUser, } = require("../controller/userController");

const decorateHtmlResponse = require("../middlewares/decorateHtmlResponse");
const uploadFile = require("../middlewares/fileUpload");
const {addUserValidators, addUserValidationHandler} = require("../middlewares/userValidators");


const { checkLogin, requireRole } = require("../middlewares/checkLogin");

const router = express.Router();

router.get("/", decorateHtmlResponse("Users"), checkLogin, requireRole(['admin']), getUsers);

//router.post("/",  checkLogin, requireRole(['admin']), uploadFile, addUserValidators, addUserValidationHandler, addUser)
router.post("/", addUser)
router.delete("/:id", checkLogin, requireRole(['admin']), removeUser);

module.exports = router;
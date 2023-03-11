const express = require("express");

// internal imports
const {getLogin, login, logout} = require("../controller/loginController")
const decorateHtmlResponse = require("../middlewares/decorateHtmlResponse");
const {
    doLoginValidators,
    doLoginValidationHandler,
  } = require("../middlewares/loginValidators");
  
const { redirectAllreadyLoggedIn } = require("../middlewares/checkLogin");
const router = express.Router();

// login page
router.get("/", decorateHtmlResponse("Login"),redirectAllreadyLoggedIn, getLogin);

router.post("/", decorateHtmlResponse("Login"), doLoginValidators, doLoginValidationHandler, login);

router.delete("/", logout);

module.exports = router;
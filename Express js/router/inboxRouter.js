const express = require("express");

// internal imports
const {getInbox, 
    searchUser,
    addConversation,
    getMessages,
    sendMessage} = require("../controller/inboxController")
const decorateHtmlResponse = require("../middlewares/decorateHtmlResponse");
const { checkLogin } = require("../middlewares/checkLogin");
const attachmentUpload = require("../middlewares/attachmentUpload");

const router = express.Router();

// inbox page
router.get("/", decorateHtmlResponse("Inbox"), checkLogin, getInbox);

// search user for conversation
router.post("/search", checkLogin, searchUser);

// add conversation
router.post("/conversation", checkLogin, addConversation);

// get messages of a conversation
router.get("/messages/:conversation_id", checkLogin, getMessages);

// send message
router.post("/message", checkLogin, attachmentUpload, sendMessage);
module.exports = router;
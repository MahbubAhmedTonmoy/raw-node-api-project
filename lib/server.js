//dependencies
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");
const environmet = require("../helpers/environment");
// module scaffolding
const server = {};

//create server
server.createServer = () => {
  const createServer = http.createServer(server.handleReqRes);
  createServer.listen(environmet.port, () => {
    console.log(`server rinning in ${environmet.port}`);
  });
};

//handle Request Response
server.handleReqRes = handleReqRes;

server.init = () => {
  server.createServer();
};

module.exports = server;

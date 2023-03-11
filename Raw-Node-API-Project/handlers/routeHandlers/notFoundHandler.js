const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    message: "not found",
  });
};

module.exports = handler;

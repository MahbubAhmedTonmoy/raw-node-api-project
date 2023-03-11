const handler = {}

handler.sampleHandler = (requestProperties, callback) => {

    console.log(requestProperties);
    callback(200, {
        message: "sample URL"
    })
}

module.exports = handler;
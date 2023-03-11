const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes= require('../routes');
const {notFoundHandler} = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

const handler = {}

handler.handleReqRes = (req, res) => {
    //handle req
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryString = parseUrl.query;
    const headers = req.headers;

    const requestProperties = {
        parseUrl, path, trimmedPath, method, queryString, headers
    }
   
    const routeHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    const decoder = new StringDecoder('utf8');
    let payload = '';
    req.on('data', (buffer) =>{
        payload += decoder.write(buffer);
    });

    req.on('end', () => {
        payload += decoder.end();
        requestProperties.body = parseJSON(payload);
        
        routeHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof(statusCode) === 'number'? statusCode : 500;
            payload = typeof(payload) === 'object'? payload : {};
    
            const payloadString = JSON.stringify(payload);
            // return final responsr
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        })
    })  
}

module.exports = handler;
//dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../helpers/utilities');
const { sendSMS } = require('../helpers/notification');
// module scaffolding
const worker = {};

worker.gatherAllChecks = () =>{
    data.getAll('checks', (err1, checks)=>{
        if(!err1 && checks && checks.length > 0){
            checks.forEach(check => {
                data.read('checks', check, (err2, originalCheckData) => {
                    if(!err2 && originalCheckData){
                        worker.validateCheckData(parseJSON(originalCheckData));
                    }
                    else{
                        console(err2)
                    }
                })
            });
        }
        else{
            console.log(err1);
        }
    })
}

// validate individual check data
worker.validateCheckData = (originalCheckData) => {
    const originalData = originalCheckData;
    if (originalCheckData && originalCheckData.id) {
        originalData.state =
            typeof originalCheckData.state === 'string' &&
            ['up', 'down'].indexOf(originalCheckData.state) > -1
                ? originalCheckData.state
                : 'down';

        originalData.lastChecked =
            typeof originalCheckData.lastChecked === 'number' && originalCheckData.lastChecked > 0
                ? originalCheckData.lastChecked
                : false;

        // pass to the next process
        worker.performCheck(originalData);
    } else {
        console.log('Error: check was invalid or not properly formatted!');
    }
};

worker.performCheck = (originalCheckData) => {
    let checkResult = {
        error: false,
        responseCode: false,
    }
    let requestSent = false;

    const parsedUrl  = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    const hostName= parsedUrl.hostname;
    const {path} = parsedUrl;

    const requestDetails = {
        protocol: `${originalCheckData.protocol}:`,
        hostname: hostName,
        method: originalCheckData.method.toUpperCase(),
        path,
        timeout: originalCheckData.timeoutSeconds * 1000,
    }
    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;

    const req = protocolToUse.request(requestDetails, (res) => {
        const status = res.statusCode;
        checkResult.responseCode = status;
        if(!requestSent){
            worker.processCheckOutcome(originalCheckData, checkResult);
            requestSent = true;
        }
    })

    req.on('error', (e)=>{
        checkResult = {
            error: true,
            value: e,
        }
        if(!requestSent){
            worker.processCheckOutcome(originalCheckData, checkResult);
            requestSent = true;
        }
    })
    req.on('timeout', () => {
        checkResult = {
            error: true,
            value: 'timeout',
        };
        // update the check outcome and pass to the next process
        if (!requestSent) {
            worker.processCheckOutcome(originalCheckData, checkResult);
            requestSent = true;
        }
    });

    // req send
    req.end();
}
// save check outcome to database and send to next process
worker.processCheckOutcome = (originalCheckData, checkResult) => {
    // check if check outcome is up or down
    const state =
        !checkResult.error &&
        checkResult.responseCode &&
        originalCheckData.successCodes.indexOf(checkResult.responseCode) > -1
            ? 'up'
            : 'down';

    // decide whether we should alert the user or not
    const alertWanted = !!(originalCheckData.lastChecked && originalCheckData.state !== state);

    // update the check data
    const newCheckData = originalCheckData;

    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // update the check to disk
    data.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            if (alertWanted) {
                // send the checkdata to next process
                worker.alertUserToStatusChange(newCheckData);
            } else {
                console.log('Alert is not needed as there is no state change!');
            }
        } else {
            console.log('Error trying to save check data of one of the checks!');
        }
    });
};

// send notification sms to user if state changes
worker.alertUserToStatusChange = (newCheckData) => {
    const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
        newCheckData.protocol
    }://${newCheckData.url} is currently ${newCheckData.state}`;

    sendSMS(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            console.log(`User was alerted to a status change via SMS: ${msg}`);
        } else {
            console.log('There was a problem sending sms to one of the user!');
        }
    });
};


worker.loop = () => {
    setInterval(() =>{
        worker.gatherAllChecks();
    }, 5000);
}

worker.init = () => {
    worker.gatherAllChecks();
    worker.loop();
};

module.exports = worker;

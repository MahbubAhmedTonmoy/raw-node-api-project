//module scaffolding
const environments = {}

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'afcsfcsw4rwsdw4rfrtsd',
    maxChecks: 5,
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: ''
    }
}
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'afcsfcsw4rwsdw4rfrtsd',
    maxChecks: 5,
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: ''
    }
}

//determain command
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.staging;

// export module
module.exports = environmentToExport;
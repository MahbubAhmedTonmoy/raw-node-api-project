//dependencies
const server = require('./lib/server');
const worker = require('./lib/workers');
// module scaffolding
const app = {};


app.init = () =>{
    //start server
    server.init();
    //start worker
    worker.init();
}
app.init();
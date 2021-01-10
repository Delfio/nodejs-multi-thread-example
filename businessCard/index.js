const data = require('./resources/data.json');
const cp = require('child_process');
const modulePath = `${__dirname}/worker.js`;

;
(async function main() {
    for (const item of data) {
        const worker = cp.fork(modulePath, []);
        worker.on('message', msg => console.log("message caught on parent, %s", msg));
        worker.on('error', msg => console.error("error caught on parent, %s", msg));

        worker.send(item);
    }
})()
const path = require('path');
const { isMainThread, Worker } = require('worker_threads');

const pathWorkerFibbonacci = path.resolve(__dirname, 'fibonacci.js');

const app = (num) => {

    // repass responsibility of work for new thread
    if(isMainThread) {
        const worker = new Worker(pathWorkerFibbonacci);
    
        worker.once('message', message => {
            console.log(`${process.pid} - ${num} | ${message}`);
        });
    
        worker.once('error', console.error);
    
        worker.postMessage(num);
    };
}


module.exports = app;

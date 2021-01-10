const { parentPort } = require('worker_threads');

function fibo(n) {
    if (n === 1) return 1;
    if (n === 2) return 2;
    return fibo(n - 1) + fibo(n - 2);
};

parentPort.once('message', message => {
    const result = fibo(Number(message));

    parentPort.postMessage(result);
})

module.exports = fibo;
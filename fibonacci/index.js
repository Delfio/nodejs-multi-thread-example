const Cluster = require('cluster');
const app = require('./worker');

if(Cluster.isMaster) {
    const workers = [];
    const workerFinished = [];

    const NUMBER_OR_PROCESS = 3;

    // create cluster of process
    for (let i = 0; i < NUMBER_OR_PROCESS; i++) {
        const worker = Cluster.fork();
        
        worker.once('message', (message) => {
            console.log('mensagem do worker', message);
            workerFinished.push(1);
        });

        worker.once('error', (err) => {
            console.error('ocorreu um erro no worker %s', err);
        });

        workers.push(worker);
    }

    workers.forEach(worker => {
        worker.addListener('online', () => {
            console.log("worker no ar ID - %s", worker.process.pid);
        });
    })
} else {
    const number = () => {
        const initial = Math.round(Math.random() * 100);
        if (initial >= 40) return Math.round(initial / 2);
        return initial;
    };

    app(number());
}
const path = require('path')
const { isMainThread, Worker } = require('worker_threads');

const main = async () => {

    const pathPizzas = [
        {
            path: path.resolve(__dirname, 'assets', 'pizza01.jpg'),
            outpath: 'images/jpg',
            extension: 'jpg'
        },
        {
            path: path.resolve(__dirname, 'assets', 'pizza02.jpg'),
            outpath: 'images/webp',
            extension: 'webp'
        },
        {
            path: path.resolve(__dirname, 'assets', 'pizza03.jpg'),
            outpath: 'images/webpt',
            extension: 'webpt'
        }
    ];
    
    if(isMainThread) {
        for await(const pathPizza of pathPizzas) {

            const fileWorkerSaveIMG = path.resolve(__dirname, 'workerIMG.js');
            const worker = new Worker(fileWorkerSaveIMG);

            const {
                extension,
                outpath,
                path: pathPizzaExtrat
            } = pathPizza;

            worker.once('message', (message) => {
                console.log(message);

                worker.terminate();
            });
        
            worker.on('error', console.error);

            const data = {
                extension,
                outpath,
                file: pathPizzaExtrat
            };

            worker.postMessage(data);

        }

    }
}

main()

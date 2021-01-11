const { parentPort } = require('worker_threads');
const { promises, existsSync } = require('fs');
const sharp = require('sharp')
const { v1 } = require('uuid');
const path = require('path')

const OUTPUT_IMAGE = path.resolve(__dirname, 'output');

async function saveImage(file, fileOutput, outputPath) {
    const fileOutputNormalise = path.join(OUTPUT_IMAGE, outputPath);

    if(!existsSync(fileOutputNormalise)) {
        await promises.mkdir(fileOutputNormalise, {
            recursive: true
        });
    }

    await file.toFile(fileOutput);
}

const resizeImage = async ({file, outpath, extension}) => {

    const filePrefix = v1();

    const fullOutputPath = `${path.join(
        OUTPUT_IMAGE,
        outpath,
        filePrefix
    )}.${extension}`;

    const image = await sharp(file); // recive buffrer

    const resized = image.rotate().resize({
        width: 150,
        height: 150
    });

    await saveImage(resized, fullOutputPath, outpath)
}


parentPort.on('message', (data) => {
    console.time(`total ${process.pid}`);

    const {
        extension,
        outpath,
        file
    } = data;

    const saveFile = resizeImage({
        file,
        outpath,
        extension
    });
    console.timeEnd(`total ${process.pid}`);

    saveFile
        .then(() => {
            parentPort.postMessage('sucess');
        }).catch((err) => {
            console.error("deu erro ", err)
            parentPort.postMessage('error');
        });

});

module.exports = saveImage;
const queryString = require('querystring');
const { join } = require('path');
const { v1 } = require('uuid');
const puppeteer = require('puppeteer');

const BASE_URL = 'https://erickwendel.github.io/business-card-template/index.html'

function createQueryStringFromObject(data) {
    return queryString.stringify(
        data,
        null,
        null,
        {
            encodeURIComponent: queryString.unescape
        }
    )
}

async function render({finalURI, name}) {
    const output = join(__dirname, `./output/${name}-${v1()}.pdf`);

    const broser = await puppeteer.launch({
        // headless: false
    });

    const page = await broser.newPage();
    await page.goto(finalURI, { waitUntil: 'networkidle2' });

    await page.pdf({
        path: output,
        format: 'A4',
        landscape: true,
        printBackground: true
    });

    await broser.close();
}

async function main(message) {
    const pid = process.pid;

    console.log(`${pid} got a message ! %s`, message.name);
    
    const qs = createQueryStringFromObject(message);
    const finalURI = `${BASE_URL}?${qs}`;
     
    try {
        await render({
            finalURI, 
            name: message.name
        });

        process.send(`${pid} - has finished!`)
    } catch(err) {
        process.send(`${pid} - has broken [${err}]`)
    }
};

process.once('message', main);
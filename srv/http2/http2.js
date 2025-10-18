// @ts-nocheck
import { Worker } from 'node:worker_threads';

const req_worker = new Worker('./req_worker.js');
const http2_worker = new Worker('./http2_worker.js');

http2_worker.on('message', (msg) => {
    console.log('from http2_worker to req_worker')
    req_worker.postMessage(msg);
    })
req_worker.on('message', (msg) => {
    console.log('from req_worker to http2_worker');
    http2_worker.postMessage(msg);
})

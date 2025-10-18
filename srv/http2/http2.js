// @ts-nocheck
import { Worker } from 'node:worker_threads';

const msgs_worker = new Worker('./msgs_worker.js');
const http2_worker = new Worker('./http2_worker.js');

http2_worker.on('message', (msg) => {
    console.log('Message from http2_worker to msgs_worker:' + msg )
    msgs_worker.postMessage(msg);
    })
msgs_worker.on('message', (msg) => {
    console.log('Message from msgs_worker to http2_worker:' + msg);
    http2_worker.postMessage(msg); // this last one goes into 
})

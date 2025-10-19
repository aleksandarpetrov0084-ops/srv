// @ts-nocheck
import { Worker } from 'node:worker_threads';
import Msg from './msg.js';

const msgs_worker = new Worker('./msgs_worker.js');
const http2_worker = new Worker('./http2_worker.js');


http2_worker.on('message', (msg) => {
    // Incoming messages (http2 req) are passed to msgs_worker for processing
    const m = Msg.fromJSON(msg)
       
    console.log('Message from http2_worker to msgs_worker:' + m )
    msgs_worker.postMessage(msg);
    })
msgs_worker.on('message', (msg) => {
    // Processed messages
    console.log('Message from msgs_worker to http2_worker:' + m);
    http2_worker.postMessage(msg); // this last one goes into 
})

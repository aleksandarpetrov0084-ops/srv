import Msg from './msg.js';
import { Worker } from 'node:worker_threads';
import { fork } from 'child_process';

//const msgs_worker = new Worker('./msgs_worker.js');
//const http2_worker = new Worker('./http2_worker.js');

const msgs_worker = fork('./msgs_worker.js');
const http2_worker = fork('./http2_worker.js');
console.log('./msgs_worker.js', http2_worker.pid )
console.log('./http2_worker.js', msgs_worker.pid)

http2_worker.on('message', (msg) => {
    // Incoming messages (http2 req) are passed to msgs_worker for processing
    const m = Msg.fromJSON(msg)
       
   console.log('Message from http2_worker :', m.toJSON())
    msgs_worker.send(msg);
    })
msgs_worker.on('message', (msg) => {
    // Processed messages
   console.log('Message from msgs_worker ' + msg);
  //  http2_worker.postMessage(msg); // this last one goes into 
})


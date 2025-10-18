import { parentPort } from 'node:worker_threads';
import Msgs_pro from './msgs_pro.js';
import Msgs from './msgs.js';

const msgs = new Msgs()
const msgs_pro = new Msgs_pro(msgs);
msgs_pro.start();

parentPort.on('message', (msg) => {
    console.log('Message received by msg_worker:' + msg);
 
    msgs.enqueue(msg);

    console.log('Message enqueued for msgs_pro' + msg); 
   // parentPort.postMessage(data)

});

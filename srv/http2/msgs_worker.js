import { parentPort } from 'node:worker_threads';
import MsgsProcessor from './msgs_processor.js';
import Msgs from './msgs.js';
import Msg from './msg.js';

const msgs = new Msgs()
const http2_msgs_pro = new MsgsProcessor(msgs);
http2_msgs_pro.start();

parentPort.on('message', (msg) => {
    const m = Msg.fromJSON(msg)
    console.log('Message received by msg_worker:' + msg);
    
    msgs.enqueue(msg);

    console.log('Message enqueued for msgs_pro' + msg); 
});

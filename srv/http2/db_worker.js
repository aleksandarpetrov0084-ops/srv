import { parentPort } from 'node:worker_threads';
import Msgs from './msgs.js';
import Msg from './msg.js';
import DBProcessor from './db_processor.js';

const msgs = new Msgs()
const db_processor = new DBProcessor(msgs);
db_processor.start();

parentPort.on('message', (msg) => {
    const m = Msg.fromJSON(msg)
    console.log('Message received by db_processor:' + msg);

    msgs.enqueue(msg);

    console.log('Message enqueued for db_processor' + msg);
});

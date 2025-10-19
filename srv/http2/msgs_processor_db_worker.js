import { parentPort } from 'node:worker_threads';
import Msgs from './msgs.js';
import Msg from './msg.js';
import MsgsDBProcessor from './msgs_processor_db_processor.js';

const msgs = new Msgs()
const msgs_processor_db_processor = new MsgsDBProcessor(msgs);
msgs_processor_db_processor.start();

parentPort.on('message', (msg) => {
    const m = Msg.fromJSON(msg)
    console.log('Message received by msgs_processor_db_processor:' + msg);

    msgs.enqueue(msg);

    console.log('Message enqueued for msgs_processor_db_processor' + msg);
});

import { parentPort } from 'node:worker_threads';
import Msgs_pro from './crypto_processor.js';
import Msgs from './msgs.js';
import Msg from './msg.js';

const crypto_msgs = new Msgs()
const crypto_msgs_processor = new Msgs_pro(crypto_msgs);
crypto_msgs_processor.start();

parentPort.on('message', (msg) => {
    const m = Msg.fromJSON(msg)
    console.log('Message received by crypto_msg_worker:' + msg);

    crypto_msgs.enqueue(msg);

    console.log('Message enqueued for crypto_msgs_pro' + msg);

});
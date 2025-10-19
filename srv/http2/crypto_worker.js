import Msgs from './msgs.js';
import Worker from './worker.js';
import Processor from './processor.js';
import jwt from 'jsonwebtoken';
class CryptoWorker extends Worker {

}
class CryptoProcessor extends Processor {

    do(msg) {
        console.log('CryptoProcessor processing message:', msg);
        return this.setResult(jwt.sign(msg, 'top secret', { expiresIn: '30m' }))
       
    }

}

const msgs = new Msgs()
const processor = new CryptoProcessor('CryptoProcessor', msgs);
const crypto_worker = new CryptoWorker(processor);
crypto_worker.start();

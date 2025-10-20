import Msgs from './msgs.js';
import Wrkr from './worker.js';
import Processor from './processor.js';
import jwt from 'jsonwebtoken';
export class CryptoWorker extends Wrkr {

}
class CryptoProcessor extends Processor {

    async do(msg) {
        return await new Promise(resolve => {
            console.log('CryptoProcessor processing message:', msg);
            console.log('Sending result...');
            setImmediate(() => {
                this.setResult(jwt.sign(msg, 'top secret', { expiresIn: '30m' }))
                resolve();
            });
        });
    }
}

const msgs = new Msgs()
const processor = new CryptoProcessor('CryptoProcessor', msgs);
const crypto_worker = new CryptoWorker(processor);
crypto_worker.start();

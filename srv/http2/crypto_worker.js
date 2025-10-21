import Msgs from './msgs.js';
import Wrkr from './worker.js';
import Processor from './processor.js';
import jwt from 'jsonwebtoken';
export class CryptoWorker extends Wrkr {

}
class CryptoProcessor extends Processor {

    async do(msg) {

            console.log('CryptoProcessor processing message:', msg);
            console.log('Sending result...');
  
            this.setResult(
                jwt.sign({ data: 'payload' }, 'top secret', { expiresIn: '30m' })
            );

        };
    }


const msgs = new Msgs()
const processor = new CryptoProcessor('CryptoProcessor', msgs);
const crypto_worker = new CryptoWorker(processor);
crypto_worker.start();

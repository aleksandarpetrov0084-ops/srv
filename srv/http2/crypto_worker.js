import Msgs from './msgs.js';
import Msg from './msg.js';
import Wrkr from './worker.js';
import Processor from './processor.js';
import jwt from 'jsonwebtoken';
import { parentPort } from 'node:worker_threads';



const msgs = new Msgs()
export class CryptoWorker extends Wrkr {


    async start() {
        // start processing queue
      
        // this.#processor.setResult()   is also exposed when it shouldn't...cant be private cuz it has to be exposed
        if (parentPort) {
            //running inside a Worker Thread
            parentPort.on('message', (msg) => {
                const m = Msg.fromJSON(msg);
                console.log('Message received by parentPort');
                msgs.enqueue(msg)
                console.log('Message enqueued for parentPort');
            });
        } else if (process.send) {
            // running inside a forked child process
            process.on('message', (msg) => {
                const m = Msg.fromJSON(msg);
                console.log('Message received by process');
                msgs.enqueue(msg)
                console.log('Message enqueued for process');
            });
        } else {
            console.warn('No messaging interface detected. start() will only process local queue.');
        }
    }



}
class CryptoProcessor extends Processor {

    async do(msg) {  
        const m = Msg.fromJSON(msg)

        console.log('CryptoProcessor processing message:', msg);
            this.setResult(
                jwt.sign({ data: 'payload' }, 'top secret', { expiresIn: '30m' })
            );
        };
    }


const processor = new CryptoProcessor('CryptoProcessor', msgs);
processor.start()
const crypto_worker = new CryptoWorker(processor);
crypto_worker.start();

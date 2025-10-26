import Msgs from './msgs.js';
import Worker from './worker.js';
import Processor from './processor.js';
import Msg from './msg.js';
import { parentPort } from 'node:worker_threads';

const msgs = new Msgs()

export class DBWorker extends Worker {
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
            process.on('exit', (code, signal) => {
                console.warn(`DBWorker exited (code: ${code}, signal: ${signal}). Restarting...`);
                setTimeout(startDBWorker, 1000); // restart after 1 second
            });

            process.on('error', (err) => {
                console.log('Error:',err)
            })

        } else {
            console.warn('No messaging interface detected. start() will only process local queue.');
        }
    }
}


class DBProcessor extends Processor {
    do(msg) {
        console.log('DBProcessor processing message:', msg);
        this.setResult('DBProcessor Processed');
    }
}

const processor = new DBProcessor('DBProcessor', msgs);
processor.start()
const db_worker = new DBWorker(processor);
db_worker.start();
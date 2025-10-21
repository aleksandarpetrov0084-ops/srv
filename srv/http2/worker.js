//worker.js
import { parentPort } from 'node:worker_threads';
import Processor from './processor.js';
import Msg from './msg.js';

export default class Wrkr  {
    #processor
    constructor( processor) {
        if (!(processor instanceof Processor)) {
            throw new Error('Worker expects a Processor instance');
         }
        this.#processor = processor  
    }

    //async start() {
    //    // only starts and enques messages
    //    this.#processor.start();
    //    process.on('message', (msg) => {
    //        const m = Msg.fromJSON(msg); // for the logger
    //        console.log('Message received by', this.#processor.getName());

    //         this.#processor.enque(msg)

    //        console.log('Message enqueued for', this.#processor.getName());
    //    });
    //}



async start() {
    // start processing queue
    this.#processor.start();

    if (parentPort) {
        // running inside a Worker Thread
        parentPort.on('message', (msg) => {
            const m = Msg.fromJSON(msg);
          console.log('Message received by parentPort', this.#processor.getName());
            this.#processor.enque(msg);
            console.log('Message enqueued for parentPort', this.#processor.getName());
        });
    } else if (process.send) {
        // running inside a forked child process
        process.on('message', (msg) => {
            const m = Msg.fromJSON(msg);
            console.log('Message received by process', this.#processor.getName());
            this.#processor.enque(msg);
            console.log('Message enqueued for process', this.#processor.getName());
        });
    } else {
        console.warn('No messaging interface detected. start() will only process local queue.');
    }
}

}
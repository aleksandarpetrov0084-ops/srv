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

    async start() {
        // only starts and enques messages
         this.#processor.start();
         parentPort.on('message', (msg) => {
            const m = Msg.fromJSON(msg); // for the logger
            console.log('Message received by', this.#processor.getName());

             this.#processor.enque(msg)

            console.log('Message enqueued for', this.#processor.getName());
        });
    }
}
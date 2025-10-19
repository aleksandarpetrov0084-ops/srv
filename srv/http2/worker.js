import { parentPort } from 'node:worker_threads';
import Processor from './processor.js';
import Msg from './msg.js';

export default class Worker {

    #processor
    constructor( processor) {
        if (!(processor instanceof Processor)) {
            throw new Error('Worker expects a Processor instance');
         }

        this.#processor = processor
    }
    start() {
        this.#processor.start();
        // Listen for messages from the parent thread
        parentPort.on('message', (msg) => {
            const m = Msg.fromJSON(msg); // for the logger
            console.log('Message received by ', this.#processor.getname());

            // Enqueue the message for processing
            this.#processor.getMsgs().enqueue(msg);

            console.log('Message enqueued for', this.#processor.getname());
        });
    }
  
}
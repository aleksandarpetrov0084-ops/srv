// req_pro.js
import Msgs from './msgs.js';
import Msg from './msg.js';
import { parentPort } from 'node:worker_threads';
import jwt from 'jsonwebtoken';
export default class Msgs_pro {
    #queue;
    #running;

    constructor(queue) {
        if (!(queue instanceof Msgs)) {
            throw new Error('ReqPro expects a Msgs instance');
        }
        this.#queue = queue;
        this.#running = false;
    }

    async start() {
        this.#running = true;
        try {
            do {
                if (!this.#queue.isEmpty()) {
                    const item = this.#queue.dequeue();
                    const m = Msg.fromJSON(item)
                    // Process item (example implementation)
                    console.log('Request processed by crypto_pro:');
                    console.log(m.toJSON());
                    const token = jwt.sign(item, 'top secret', { expiresIn: '30m' })                    
                    parentPort.postMessage(token)
                    // Simulate async processing
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    // Wait 1 second if queue is empty
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } while (this.#running);
        } catch (error) {
            console.error('Error in processor:', error);
            this.#running = false;
        }
    }

    stop() {
        this.#running = false;
    }
}

//// msgs_processor.js
import Msgs from './msgs.js';
import Msg from './msg.js';
import { parentPort } from 'node:worker_threads';

export default class Processor {
    #queue;
    #running;
    #name
    #result
    #msg
    constructor(name, queue) {

        if (!(queue instanceof Msgs)) {
            throw new Error('Processor expects a Msgs instance');
        }
        this.#queue = queue;
        this.#running = false;
        this.#name = name  
    }
    do(msg) {
       
    }
    setResult(result) { this.#result = result }


    sendResult() { parentPort.postMessage(this.#result); return }
    getname() { return this.#name }

    getMsgs() { return this.#queue }    
    async start() {
        this.#running = true;
        try {
            do {
                if (!this.#queue.isEmpty()) {
                    const item = this.#queue.dequeue();
                    const m = Msg.fromJSON(item)
                    // Process item (example implementation)
                    this.do(item)
                    this.sendResult()
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
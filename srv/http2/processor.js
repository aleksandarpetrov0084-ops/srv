//// msgs_processor.js
import Msgs from './msgs.js';
import Msg from './msg.js';
import { parentPort } from 'node:worker_threads';

export default class Processor {
    #msgs;
    #running;
    #name
    #result
    constructor(name, msgs) {
        if (!(msgs instanceof Msgs)) {
            throw new Error('Processor expects a Msgs instance');
        }
        this.#msgs = msgs;
        this.#running = false;
        this.#name = name  
    }
    setResult(result) {
        this.#result = result;
    }

  async #sendResult () {
    return await new Promise(resolve => {
        console.log('Sending result...');
        setImmediate(() => {   
          ;
            resolve();
        }) ;
    }).then(parentPort.postMessage(this.#result));
}
    enque(msg) {
        this.#msgs.enqueue(msg)
    }    
    getName() {
        return this.#msgs
    }
    async start() {
        this.#running = true;
            do {
                if (!this.#msgs.isEmpty()) {
                    const item = this.#msgs.dequeue();
                    const m = Msg.fromJSON(item)
                    console.log(this.#name ,'is preparing to process')
                    await this.do(item)    
                    await this.#sendResult()
                } else {
                    // Wait 1 second if msgs is empty
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            } while (this.#running);
    }
    stop() {
        this.#running = false;
    }
}
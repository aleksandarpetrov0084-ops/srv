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
        if (typeof result === 'function') {
            console.log('It’s a function!');
            this.#result = result(); // call it
        } else {
            console.log('It’s a value.');
            this.#result = result; // just assign
        }
    }

  async #sendResult () {
    return await new Promise(resolve => {
        console.log('Sending result...');
        setImmediate(() => {   
            parentPort.postMessage(this.#result) // this runs/yielsds to the parrent thread lightining fast
            resolve();
        }) ;
    })
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
                    this.#result = null;
                    console.log('result set to null')
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
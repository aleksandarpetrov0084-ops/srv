//// processor.js
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
   async setResult(result) {
        if (typeof result === 'function') {
            console.log('setResult It’s a function!');
            this.#result = result(); // call it
        } else {
            console.log('setResult It’s a value.');
            this.#result = result; // just assign
        }
    }

    async #sendResult() {
        //if you need immediate result sending
     //   setImmediate(() => {
            if (typeof parentPort !== 'undefined' && parentPort) {
                parentPort.postMessage(this.#result);
               console.log('sendResult - postMessage:', this.#result);
            } else if (typeof process !== 'undefined' && process.send && !process.killed) {
                try {
                    process.send(this.#result);
                   console.log('sendResult - process.send:', this.#result);
                } catch (err) {
                    console.warn('Cannot send result, channel closed:', err.message);
                }
            } else {
             //   console.warn('No messaging interface available. Result:', this.#result);
            }
      //  });
    }
    enque(msg) {
        this.#msgs.enqueue(msg)
    }    
    getName() {
        return this.#name
    }
    async start() {
        this.#running = true;
            do {
                if (!this.#msgs.isEmpty()) {
                    const item = this.#msgs.dequeue();
                    const m = Msg.fromJSON(item)
                   // console.log(this.#name, 'is calling async do() for', item)
                    await this.do(item)    
                    await this.#sendResult()
                    //  this.#result = null;
                   // const now = new Date();
                   // console.log(now); // Example: 2025-10-21T18:42:12.345Z
                   // console.log(process.memoryUsage())
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
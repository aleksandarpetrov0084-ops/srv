//worker.js
// This class can be initialized for parentPort(thread) or process (fork) because you scale easily that way
// I stoped at the name "worker" because fork, thread, process are a bit more confusing to me
// This class interfaces with a processors public methods to enque

import Processor from './processor.js';

export default class Wrkr  {
    #processor
    constructor(processor) {
        if (!(processor instanceof Processor)) {
            throw new Error('Worker expects a Processor instance');
         }
        this.#processor = processor  
    }
}
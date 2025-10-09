// qu_processor.js
import  Queue  from './queue.js';

export default class qu_processor {
    #queue;
    #running;

    constructor(queue) {
        if (!(queue instanceof Queue)) {
            throw new Error('qu_processor expects a Queue instance');
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
                    // Process item (example implementation)
                    console.log('Processing:', item);
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
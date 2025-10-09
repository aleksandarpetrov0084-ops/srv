// queue.js
 class Queue {
    #items; // private field

    constructor() {
        this.#items = [];
    }

    // Add item to the queue (enqueue)
    enqueue(item) {
        this.#items.push(item);
    }

    // Remove item from the queue (dequeue)
    dequeue() {
        return this.#items.shift();
    }

    // Check if the queue has items
     isEmpty() {
         return this.#items.length === 0;
     }

    // Peek at the front item without removing
    peek() {
        return this.#items[0];
    }

    // Get all items (for debugging/logging)
    all() {
        return [...this.#items];
     }

     size() {
         return this.#items.length; // number of items currently in the queue
     }
}
export default Queue
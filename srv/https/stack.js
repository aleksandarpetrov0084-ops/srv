// This is a stack
class Stack {

    constructor() {
        this.#stack = [];
    }
    
    push(item) {this.#stack.push(item)}
    pop() {return this.#stack.pop()}
    peek() {return this.#stack[this.#stack.length - 1]}
    length() {return this.#stack.length}
    isEmpty() {return this.#stack.length === 0}
    has(item) {return this.#stack.includes(item);}
}
export default Stack
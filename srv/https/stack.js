// This is a stack
class Stack {
    #stack = [];
    push(item) { this.#stack.push(item) }
    pop() { return this.#stack.pop() }
    peek() { return this.#stack[this.#stack.length - 1] }
    length() { return this.#stack.length }
    isEmpty() { return this.#stack.length === 0}
}
export default Stack
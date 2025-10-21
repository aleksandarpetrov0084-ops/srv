import { parentPort } from 'node:worker_threads';

class Msg {
    #time;
    #type;
    #isAction;
    #user
    #action
    #data
    #message
    constructor(time, type, user, message, data, isAction = false, action ='')
    {
        this.#time = time;
        this.#type = type;
        this.#isAction = isAction;
        this.#action = action;
        this.#user = user;
        this.#data = data;
        this.#message = message;    
    }
     time() { return this.#time; }
     type() { return this.#type; }
     isAction() { return this.#isAction; }
     action() { return this.#action; }
     user() { return this.#user; }   
     data() { return this.#data; }   
    message() { return this.#message; }

    send() {
      
        if (typeof parentPort !== 'undefined' && parentPort) {
            // Worker Thread
            parentPort.postMessage(this);
        } else if (typeof process !== 'undefined' && process.send) {
            // Forked child process
            try {
                process.send(this);
            } catch (err) {
                console.warn('Cannot send message, IPC channel closed:', err.message);
            }
        } else {
            // fallback if no messaging is available
            console.log('Msg.send fallback (no IPC):', this);
        }
    }

     toJSON() {
        return {
            time: this.#time,
            type: this.#type,
            isAction: this.#isAction,
            action: this.#action,
            user: this.#user,
            data: this.#data,
            message: this.#message
        };
    }
    static fromJSON(obj) {
        if (typeof obj !== 'object' || obj === null) {
            throw new TypeError('Invalid object for Msg.fromJSON');
        }
        const { time, type, user, message, data, isAction, action } = obj;
        return new Msg(time, 'static', user, message, data, isAction, action);
    }
}

export default Msg;

import Msgs from './msgs.js';
import Msg from './msg.js';
import Wrkr from './worker.js';
import Processor from './processor.js';
import { parentPort } from 'node:worker_threads';
class MsgsWorker extends Wrkr {

    async start() {
     
        if (parentPort) {
            //running inside a Worker Thread
            parentPort.on('message', (msg) => {
                const m = Msg.fromJSON(msg);
                console.log('Message received by parentPort');
                msgs.enqueue(msg)
                console.log('Message enqueued for parentPort');
            });
        } else if (process.send) {
            // running inside a forked child process
            process.on('message', (msg) => {
                const m = Msg.fromJSON(msg);
                console.log('Message received by process');
                msgs.enqueue(msg)
                console.log('Message enqueued for process')
            });
            process.on('exit', (code, signal) => {
                console.warn(`DBWorker exited (code: ${code}, signal: ${signal}). Restarting...`);
                setTimeout(startDBWorker, 1000); // restart after 1 second
            });
            process.on('error', (err) => {
                console.log('Error:', err)
            })
        } else {
            console.warn('No messaging interface detected. start() will only process local queue.');
        }
    }
}

class MsgsProcessor extends Processor {


    async do(msg) {
        console.log('MsgsProcessor processing message:', msg);
        await this.setResult("MsgsProcessor async do(setResult())")

        //return await new Promise(resolve => {

        //    this.setResult(() => {
        //      //  this.setResult(null)  // only this runs first      
        //        console.log('MsgsProcessor processing message:', msg);
        //        //setImmediate(() => {
        //      return  resolve();
        //        //});
        //    })   // only this runs first        
        //});
    } 
}     


const msgs = new Msgs();
const processor = new MsgsProcessor('MsgsProcessor', msgs);
processor.start()
const msgs_worker = new MsgsWorker(processor);
msgs_worker.start();



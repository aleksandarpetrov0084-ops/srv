
import Msgs from './msgs.js';
import Wrkr from './worker.js';
import Processor from './processor.js';
import { parentPort } from 'node:worker_threads';
class MsgsWorker extends Wrkr {}

class MsgsProcessor extends Processor {


    async do(msg) {
        return await new Promise(resolve => {

            this.setResult(() => {
              //  this.setResult(null)  // only this runs first      
                console.log('MsgsProcessor processing message:', msg);
                //setImmediate(() => {
              return  resolve();
                //});
            })   // only this runs first        
        });
    } 
}     


const msgs = new Msgs();
const processor = new MsgsProcessor('MsgsProcessor', msgs);
const msgs_worker = new MsgsWorker(processor);
msgs_worker.start();



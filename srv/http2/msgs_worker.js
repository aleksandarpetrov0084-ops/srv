
import Msgs from './msgs.js';
import Worker from './worker.js';
import Processor from './processor.js';

class MsgsWorker extends Worker 
{


}

class MsgsProcessor extends Processor {
    do(msg) {
        console.log('MsgsProcessor processing message:', msg);
        return this.setResult('Processed')
    }

}
const msgs = new Msgs();
const processor = new MsgsProcessor('MsgsProcessor', msgs);
const msgs_worker = new MsgsWorker(processor);
msgs_worker.start();



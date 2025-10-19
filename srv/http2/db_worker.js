import Msgs from './msgs.js';
import Worker from './worker.js';
import Processor from './processor.js';

class DBWorker extends Worker {

}
class DBProcessor extends Processor {

    do(msg) {
        console.log('DBProcessor processing message:', msg);
    
        return this.setResult('Processed');
    }
}

const msgs = new Msgs()
const processor = new DBProcessor('DBProcessor', msgs);
const db_worker = new DBWorker(processor);
db_worker.start();
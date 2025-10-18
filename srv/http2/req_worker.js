import { parentPort } from 'node:worker_threads';
import ReqPro from './req_pro.js';
import Req from './req.js';

const req = new Req()
const req_pro = new ReqPro(req);
req_pro.start();

parentPort.on('message', (data) => {
    console.log('REQWorker received');
    const previous = req.size();
    req.enqueue(data);
    const current = req.size();
    console.log('REQWorker sends'); 
    parentPort.postMessage(data)

});

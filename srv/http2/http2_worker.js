//http2_worker.js
import http2 from 'node:http2';
import { currentRequestHeadersHashed, getHttpsOptions, getCookie, tokenMatch } from './http2_helper.js';
import Msg from './msg.js';
import jwt from 'jsonwebtoken';
// @ts-nocheck
//import { Worker } from 'node:worker_threads';
//const crypto_worker = new Worker('./crypto_worker.js');
import { fork } from 'child_process';

(async () => {
    const httpsOptions = await getHttpsOptions()
    const server = http2.createSecureServer(httpsOptions)
    const api_name = '/api/'   //general practice to name API
    const version = 'v1'          //general practive to version API
    const secret = 'supersecret' //token and HMAC secret
    const active_sessions = {}   //Incoming requests
    const sees_cookie_name = 'sess123'  //session cookie name
    const IDtoken_cookie_name = 'IDtoken123' //token cookie name
    const AuthToken_cookie_name = 'AuthToken123' //token cookie name
    const cookie_maxAge = 30 * 60 // seconds

    const crypto_worker = fork('./crypto_worker.js');
    console.log('Process ID - ./crypto_worker.js', crypto_worker.pid)

    const db_worker = fork('./db_worker.js');
    console.log('Process ID - ./db_worker.js', db_worker.pid)

    server.on('stream', async (stream, headers) => {
        function Route(h) {
            switch (h[':method'] + h[':path']) {
                case 'GET' + api_name + version + '/users':
                    if (h['cookie'] !== undefined) {
                        processCookies(h['cookie'])
                        break;
                    } else {
                        createCookies();
                        break;
                    }
                case 'GET' + '/.well-known/appspecific/com.chrome.devtools.json':
                    break;
                default:
                    stream.respond({ ':status': 404 })
                    stream.end(JSON.stringify({ error: 'Not found' }))
                    return;;
            }
        }
      async  function processCookies(c) {
            console.log("http2_worker processCookies() method")
            const in_sessID = getCookie(c || '', sees_cookie_name);
            const in_token = getCookie(c || '', IDtoken_cookie_name);
            const in_AuthToken = getCookie(c || '', AuthToken_cookie_name);
            if (!in_token || !in_sessID || !in_AuthToken) {
                //Missing cookie workflow
                const msg = new Msg(Math.floor(Date.now() / 1000), 'type', 'admin', 'Missing cookies', headers[':path'], true, 'action')      
                msg.send()  
                stream.end(JSON.stringify(headers['cookie']))
                return;
            } else {
                if (active_sessions[in_sessID] && tokenMatch(in_token, getCookie(JSON.stringify(active_sessions[in_sessID]), IDtoken_cookie_name))) {
                //Not missing cookie and in active session 
                    const msg = new Msg(Math.floor(Date.now() / 1000), 'type', 'admin', 'DB1_In acive sessions', headers[':path'], true, 'action')
                    const db_worker_response = await new Promise((resolve, reject) => {
                        db_worker.once('message', resolve);
                        db_worker.send(msg.toJSON());
                    });
                    const db_response = db_worker_response 
                    const in_token_time = jwt.decode(in_token.toString('utf8')).exp         
                   //You have to stream.end 
                } else {              
                //Has cookies but not active
                    const msg = new Msg(Math.floor(Date.now() / 1000), 'type', 'admin', 'Has cookies and not in acive sessions', headers[':path'], true, 'action')
                    msg.send() 
                //you have to stream.end
                }
                stream.end(JSON.stringify(headers['cookie']))
                return;
            }
        }

      async  function createCookies() {
          console.log("http2_worker createCookies() method")
          const out_sessID = currentRequestHeadersHashed(JSON.stringify(headers), secret)
          if (out_sessID) {
              console.log("out_sessID", out_sessID)
          }
          const msga = new Msg(Math.floor(Date.now() / 1000), 'crypto', 'admin', 'Create token', headers[':path'], true, 'action')

          const workerResponse = await new Promise((resolve, reject) => {
              crypto_worker.once('message', resolve);
              crypto_worker.send(msga.toJSON());
          });
          
          const out_token = workerResponse
          console.log("out_token")

            const out_cookies = [
                sees_cookie_name + '=' + `${out_sessID}; Max-Age=${cookie_maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/`,
                IDtoken_cookie_name + '=' + `${out_token}; Max-Age=${cookie_maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/`,
                AuthToken_cookie_name + '=' + `admin; Max-Age=${cookie_maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/`
            ];

            active_sessions[out_sessID] = out_cookies

            stream.respond({
                ':status': 200,
                'Content-Type': 'application/json',
                'Set-Cookie': out_cookies
            });
        
          const msg = new Msg(Math.floor(Date.now() / 1000), 'type', 'admin', 'Cookies created', headers[':path'], true, 'action')
            msg.send() // to msg processor
            stream.end(JSON.stringify(out_cookies))
            return;
        }

        Route(headers);    
    })
    server.listen(443, '0.0.0.0', () => {
        console.log('HTTP/2 server running on port 443');
    })
})()
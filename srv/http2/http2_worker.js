import http2 from 'node:http2';
import { currentRequestHeadersHashed, getHttpsOptions, getCookie, tokenMatch } from './http2_helper.js';
import jwt from 'jsonwebtoken';
import Msg from './msg.js';
// @ts-nocheck
import { Worker } from 'node:worker_threads';


const crypto_worker = new Worker('./crypto_worker.js');

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
        function processCookies(c) {
           // console.log("processCookies method")
            const in_sessID = getCookie(c || '', sees_cookie_name);
            const in_token = getCookie(c || '', IDtoken_cookie_name);
            const in_AuthToken = getCookie(c || '', AuthToken_cookie_name);
            if (!in_token || !in_sessID || !in_AuthToken) {
                const msg = new Msg(Math.floor(Date.now() / 1000), 'type', 'admin', 'Missing cookies', headers[':path'], true, 'action')      
                msg.send()  
                stream.end(JSON.stringify(headers['cookie']))
                return;
            } else {
                if (active_sessions[in_sessID] && tokenMatch(in_token, getCookie(JSON.stringify(active_sessions[in_sessID]), IDtoken_cookie_name))) {
                    // If exist test
                    const msg = new Msg(Math.floor(Date.now() / 1000), 'type', 'admin', 'In acive sessions', headers[':path'], true, 'action')
                    msg.send()  
                    console.log('Expiration (exp) claim:', jwt.decode(in_token.toString('utf8')).exp)
                    console.log('Current Time (UTC):', Math.floor(Date.now() / 1000))
                } else {              

                    const msg = new Msg(Math.floor(Date.now() / 1000), 'type', 'admin', 'Has cookies and not in acive sessions', headers[':path'], true, 'action')
                    msg.send() 
                }
                stream.end(JSON.stringify(headers['cookie']))
                return;
            }
        }

      async  function createCookies() {
            console.log("createCookies method")
            const out_sessID = currentRequestHeadersHashed(JSON.stringify(headers), secret)
          const msga = new Msg(Math.floor(Date.now() / 1000), 'crypto', 'admin', 'Create token', headers[':path'], true, 'action')
          //  crypto_worker.postMessage(msga.toJSON())

            const workerResponse = await new Promise((resolve, reject) => {
                const listener = (response) => {
                    resolve(response);
                    crypto_worker.off('message', listener); // remove listener to avoid memory leaks
                };
                crypto_worker.on('message', listener);
                crypto_worker.postMessage(msga.toJSON());
            });
          //   console.log('Worker responded:', workerResponse);
             const out_token = workerResponse
           // const out_token = jwt.sign(headers, secret, { expiresIn: '30m' })
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


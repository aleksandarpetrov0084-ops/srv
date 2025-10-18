// @ts-nocheck
import http2 from 'node:http2';
import { currentRequestHeadersHashed, getHttpsOptions, getCookie, tokenMatch } from './http2_helper.js';                  
import jwt from 'jsonwebtoken';
import { Worker } from 'node:worker_threads';

const worker = new Worker('./worker.js');
worker.on('message', (msg) => console.log('Main received:', msg)); // Listen for replies

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
            console.log("processCookies method")
            const in_sessID = getCookie(c|| '', sees_cookie_name);
            const in_token = getCookie(c || '', IDtoken_cookie_name);
            const in_AuthToken = getCookie(c || '', AuthToken_cookie_name);
            if (!in_token || !in_sessID || !in_AuthToken) {
                worker.postMessage("Missing token or session ID");
                stream.end(JSON.stringify(headers['cookie']))   
                return;
            } else {
                if (active_sessions[in_sessID] && tokenMatch(in_token, getCookie(JSON.stringify(active_sessions[in_sessID]), IDtoken_cookie_name))) {
                    // console.log(in_token, getCookie(JSON.stringify(active_sessions[in_sessID]), IDtoken_cookie_name))
                    worker.postMessage("In acive sessions");
                    console.log('Expiration (exp) claim:', jwt.decode(in_token.toString('utf8')).exp)
                    console.log('Current Time (UTC):', Math.floor(Date.now() / 1000))
                    
                }
                stream.end(JSON.stringify(headers['cookie']))
                return;
            }
        }

        function createCookies() {
            console.log("createCookies method")
            const out_sessID = currentRequestHeadersHashed(JSON.stringify(headers), secret)
            const out_token = jwt.sign(headers, secret, { expiresIn: '30m' })
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
            stream.end(JSON.stringify(out_cookies))
            return;
        }
        Route(headers);
    //    if (reqPath === api_name + version + '/users' && reqMethod === 'GET') {
    //            //If cookie is not empty try to extract token & in_sessID and test if empty
    //        if (headers['cookie'] !== undefined) {        
                    
    //                const in_sessID = getCookie(headers['cookie'] || '', sees_cookie_name);
    //                const in_token = getCookie(headers['cookie'] || '', IDtoken_cookie_name);
    //                const in_AuthToken = getCookie(headers['cookie'] || '', AuthToken_cookie_name);
                    
    //                if (!in_token || !in_sessID || !in_AuthToken) { 
    //                   // console.log("Missing token or session ID");
    //                    // handle unauthorized / missing in_cookies case here
    //                    worker.postMessage("Missing token or session ID");
    //                    stream.end(JSON.stringify(headers['cookie']))                  
    //                } else {    
    //                    //Find and Test tokenExists & tokenExpired & sessionExists in activesession
    //                    if (active_sessions[in_sessID] && tokenMatch(in_token, getCookie(JSON.stringify(active_sessions[in_sessID]), IDtoken_cookie_name))) {
    //                       // console.log(in_token, getCookie(JSON.stringify(active_sessions[in_sessID]), IDtoken_cookie_name))
    //                        worker.postMessage("In acive sessions");
    //                        console.log('Expiration (exp) claim:', jwt.decode(in_token.toString('utf8')).exp)
    //                        console.log('Current Time (UTC):', Math.floor(Date.now() / 1000))
    //                    }
    //                    stream.end(JSON.stringify(headers['cookie']))
    //                }
    //            } else {
    //                // UserExists  

    //                // Create token and cookie and send them back;              
    //                const out_sessID = currentRequestHeadersHashed(JSON.stringify(headers), secret)
    //                const out_token = jwt.sign(headers, secret, { expiresIn: '30m' })     
    //                const out_cookies = [
    //                    sees_cookie_name + '=' + `${out_sessID}; Max-Age=${cookie_maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/`,
    //                    IDtoken_cookie_name + '=' + `${out_token}; Max-Age=${cookie_maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/`,
    //                    AuthToken_cookie_name + '=' + `admin; Max-Age=${cookie_maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/`
    //                ];

    //                active_sessions[out_sessID] = out_cookies
                    
    //                stream.respond({
    //                    ':status': 200,
    //                    'Content-Type': 'application/json',
    //                    'Set-Cookie': out_cookies
    //                });
    //                stream.end(JSON.stringify(out_cookies ))
    //            }
    //            // More API endpoints can be added here
    //    } else if (reqPath === api_name + version + '/test' && reqMethod === 'GET') {
    //           const responseData = await new Promise((resolve) =>
    //                setTimeout(() => resolve({ message: 'Test endpoint works!' }), 50)
    //            );
    //            stream.respond({ ':status': 200, 'content-type': 'application/json' })
    //            stream.end(JSON.stringify(responseData))
    //        } else {
    //            stream.respond({ ':status': 404 })
    //            stream.end(JSON.stringify({ error: 'Not found' }))
    //        }

    })

    server.listen(443, '0.0.0.0', () => {
        console.log('HTTP/2 server running on port 443');
    })
})() //executing async wrapper wuthout a call 
// @ts-nocheck
import http2 from 'node:http2';
import {currentRequestHeadersHashed, getHttpsOptions} from './http2_helper.js';                  
import jwt from 'jsonwebtoken';

(async () => {
    // DECLARE MOST STUFF HERE 
    const httpsOptions = await getHttpsOptions()
    const server = http2.createSecureServer(httpsOptions)
    const version = 'v1' 
    const secret = 'supersecret' //token and HMAC secret
    const active_sessions = {} //Incoming requests
    let sessID;          //Incoming cookie
    let token;           //Incoming cookie
    let sessHashedID;
    let responseData;   // dummy variable
    let reqPath;
    let method;
    let cookies;       // incoming cookies
    server.on('stream', async (stream, headers) => {
         reqPath = headers[':path']
         method = headers[':method']      
            if (reqPath === '/api/' + version + '/users' && method === 'GET') {
                //If cookie is not empty try to extract token & sessID and test if empty
                if (headers['cookie'] !== undefined) {                   
                    token = null;
                    sessID = null;
                    cookies = null;
                    cookies = headers['cookie'] || '';
                    if (cookies.includes('token=')) {
                        token = cookies.split('token=')[1].split(';')[0];
                    }
                    if (cookies.includes('sess=')) {
                        sessID = cookies.split('sess=')[1].split(';')[0];
                    }
                    if (!token || !sessID) {
                        console.log("Missing token or session ID");
                        stream.end(JSON.stringify(headers['cookie']))
                        // handle unauthorized / missing cookies case here
                    } else {
                        console.log("Token:", token);
                        console.log("Session ID:", sessID);
                        //Find and Test tokenExists & tokenExpired & sessionExists in activesession
                        //onsole.log('Expiration (exp) claim:', jwt.decode(token).exp)
                      console.log('Current Time (UTC):', Math.floor(Date.now() / 1000))
       //        const { cookie, ...headersWithoutCookie } = headers
                     // sessHashedID = currentRequestHeadersHashed(JSON.stringify(headersWithoutCookie), secret)
                        stream.end(JSON.stringify(headers['cookie']))
                    }
                } else {
                    // Create token and cookie and send them back
                    sessHashedID = currentRequestHeadersHashed(JSON.stringify(headers), secret)
                    const token = jwt.sign(headers, secret, { expiresIn: '30m' })
                    const maxAge = 30 * 60 // seconds
                    const cookies = [
                        `sess=${sessHashedID}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/`,
                        `token=${token}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/`,
                    ];

                    active_sessions[sessHashedID] = cookies

                    stream.respond({
                        ':status': 200,
                        'Content-Type': 'application/json',
                        'Set-Cookie': cookies
                    });
                    stream.end(JSON.stringify( cookies ))
                }
                // More API endpoints can be added here
            } else if (reqPath === '/api/' + version + '/test' && method === 'GET') {
                responseData = await new Promise((resolve) =>
                    setTimeout(() => resolve({ message: 'Test endpoint works!' }), 50)
                );
                stream.respond({ ':status': 200, 'content-type': 'application/json' })
                stream.end(JSON.stringify(responseData))
            } else {
                stream.respond({ ':status': 404 })
                stream.end(JSON.stringify({ error: 'Not found' }))
            }

    })

    server.listen(443, '0.0.0.0', () => {
        console.log('HTTP/2 server running on port 443');
    })
})() //executing async wrapper wuthout a call 
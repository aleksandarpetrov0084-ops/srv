// @ts-nocheck
import http2 from 'node:http2';
import {currentRequestHeadersHashed, getHttpsOptions} from './http2_helper.js';                  
import jwt from 'jsonwebtoken';

(async () => {
    // DECLARE MOST STUFF HERE 
    const httpsOptions = await getHttpsOptions()
    const server = http2.createSecureServer(httpsOptions)
    const version = 'v1' 
    const secret = 'supersecret'
    const active_sessions = {} 

    server.on('stream', async (stream, headers) => {
        const reqPath = headers[':path']
        const method = headers[':method']
        try {         
            let responseData;   
            let sessHashedID;
            if (reqPath === '/api/' + version + '/users' && method === 'GET') {
   
                if (headers['cookie'] !== undefined) {
                    const token = headers['cookie'].split('token=')[1].split(';')[0]   
                    const sess = headers['cookie'].split('sess=')[1].split(';')[0]  
                    console.log('Session ID from cookie:', sess)
                    //Find and Test tokenExists & tokenExpired sessionExists in activesession
                    console.log('Expiration (exp) claim:', jwt.decode(token).exp)
                    console.log('Current Time (UTC):', Math.floor(Date.now() / 1000))
                    const { cookie, ...headersWithoutCookie } = headers
                    sessHashedID = currentRequestHeadersHashed(JSON.stringify(headersWithoutCookie), secret)
                    stream.end(JSON.stringify(headers['cookie']))

                } else {

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
        } catch (err) {
            console.error('Request error:', err);
            stream.respond({ ':status': 500, 'content-type': 'application/json' });
            stream.end(JSON.stringify({ error: 'Internal server error' }));
        }
    })

    server.listen(443, '0.0.0.0', () => {
        console.log('HTTP/2 server running on port 443');
    })
})() //executing async wrapper wuthout a call 
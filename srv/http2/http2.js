// @ts-nocheck
// =======================
// Required modules
// =======================
//import http2Express from 'http2-express-bridge';
//import express from 'express';               // Express framework for HTTP routing
//import https from 'https';                   // Node HTTPS server
import http2 from  'node:http2';
import fs from 'fs/promises';                // Async filesystem operations
import path from 'path';                     // Path utilities
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Queue from './queue.js' 
import Headers from './headers.js'
import { client } from './headers.js'
import que_processor from './qu_processor.js'
// =======================
// HTTPS options (async)
// =======================
// Read SSL key and certificate files asynchronously
 async function getHttpsOptions() {
    const key = await fs.readFile(path.join(process.cwd(), 'key', 'key.pem'));   // Private key
    const cert = await fs.readFile(path.join(process.cwd(), 'cert', 'cert.pem')); // Public cert
    return { key, cert };
}
(async () => {
    // DECLARE MOST STUFF HERE 
    const httpsOptions = await getHttpsOptions();
    const server = http2.createSecureServer(httpsOptions);
    const version = 'v1' 
    const secret = 'supersecret';
    const active_sessions = {};  
    function currentRequestHeadersHashed(headers, hasher = 'sha512') {
        switch (hasher) {
            case 'sha256':
                return crypto.createHash('sha256').update(headers).digest('hex');
            case 'sha512':
                return crypto.createHash('sha512').update(headers).digest('hex');
            case 'hmac':
                return crypto.createHmac('sha256', secret).update(headers).digest('hex');
            default:
                throw new Error(`Unknown hasher: ${hasher}`);
        }
    };
    server.on('stream', async (stream, headers) => {
        const reqPath = headers[':path'];
        const method = headers[':method'];
        try {
            // Example async operation (placeholder for DB query later)
            let responseData;            
            if (reqPath === '/api/' + version + '/users' && method === 'GET') {
                //Create a hashed session ID from the headers
                const sessHashedID = currentRequestHeadersHashed(JSON.stringify(headers));
                //console.log(currentRequestHeadersHashed(JSON.stringify(headers)));
                if (sessHashedID in active_sessions) {
                    console.log('Key exists!'); 
                    stream.respond({
                        ':status': 200,
                        'Content-Type': 'application/json',
                    });
                    console.log(Object.keys(active_sessions).length);
                    stream.end(JSON.stringify(sessHashedID));
                } else {

                    const token = jwt.sign(headers, secret, { expiresIn: '30m' });
                    const cookie = {
                        name: sessHashedID,
                        token: token,
                        maxAge: 30 * 60,       // in seconds
                        httpOnly: true,
                        secure: true,
                        sameSite: 'Lax',
                        path: '/' + sessHashedID
                    };
                    active_sessions[sessHashedID] = cookie;

                    stream.respond({
                        ':status': 200,
                        'Content-Type': 'application/json',
                        'Set-Cookie': cookie
                    });
                    stream.end(JSON.stringify(cookie));
                }
                // Placeholder async operation (simulating DB fetch)
                //responseData = await new Promise((resolve) =>
                //    setTimeout(() => resolve([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]), 50)
                //);
                //stream.respond({ ':status': 200, 'content-type': 'application/json' });
                //stream.end(JSON.stringify(responseData));
            } else if (reqPath === '/api/' + version + '/test' && method === 'GET') {
                responseData = await new Promise((resolve) =>
                    setTimeout(() => resolve({ message: 'Test endpoint works!' }), 50)
                );
                stream.respond({ ':status': 200, 'content-type': 'application/json' });
                stream.end(JSON.stringify(responseData));
            } else {
                stream.respond({ ':status': 404 });
                stream.end(JSON.stringify({ error: 'Not found' }));
            }
        } catch (err) {
            console.error('Request error:', err);
            stream.respond({ ':status': 500, 'content-type': 'application/json' });
            stream.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });

    server.listen(443, '0.0.0.0', () => {
        console.log('HTTP/2 server running on port 443');
    });
})();




//// =======================
//// Initialize Express app
//// =======================
//const app = express();
//app.use(express.json()); // Parse JSON request bodies

//// =======================import
//// SQLCipher encryption key
//// =======================
//const DB_PASSWORD = 'my-secret-password'; // Key to encrypt both users & sessions DB

//// =======================
//// Encrypted SQLite DB for users
//// =======================
//const usersDbFile = path.join(process.cwd(), 'users.db');  // Path to users DB
//const usersDb = new Database(usersDbFile);                 // Open DB file
//usersDb.pragma(`key = '${DB_PASSWORD}'`);                 // Set encryption key

//// Create users table if missing
//usersDb.prepare(`
//    CREATE TABLE IF NOT EXISTS users (
//        id INTEGER PRIMARY KEY AUTOINCREMENT, 
//        name TEXT NOT NULL                     
//    )
//`).run();

//// Insert default users if table is empty
//const userCount = usersDb.prepare('SELECT COUNT(*) AS count FROM users').get().count;
//if (userCount === 0) {
//    usersDb.prepare('INSERT INTO users (name) VALUES (?)').run('Alice');
//    usersDb.prepare('INSERT INTO users (name) VALUES (?)').run('Bob');
//}

//// =======================
//// Encrypted SQLite DB for sessions
//// =======================
//const sessionDbFile = path.join(process.cwd(), 'sessions.db'); // Path to sessions DB
//const sessionDb = new Database(sessionDbFile);
//sessionDb.pragma(`key = '${DB_PASSWORD}'`); // Encryption key

//// Create sessions table if missing
//sessionDb.prepare(`
//    CREATE TABLE IF NOT EXISTS sessions (
//        sid TEXT PRIMARY KEY,   
//        sess TEXT NOT NULL,     
//        expire INTEGER        
//    )
//`).run();

//// =======================
//// SQLite session store
//// =======================
//const SQLiteStore = SQLiteStoreFactory(session);
//const sessionStore = new SQLiteStore({
//    driver: sessionDb.constructor,   // Pass the database class (better-sqlite3), not instance
//    db: 'sessions.db',               // Filename of the SQLite DB
//    dir: process.cwd(),              // Directory containing the DB file
//    table: 'sessions',               // Table used for active sessions
//    concurrentDB: true,              // Allow multiple connections simultaneously
//    pruneExpiredInterval: 60 * 60,   // Auto-prune expired sessions every hour
//    ttl: 30 * 60,                    // Session TTL in seconds (30 minutes)
//    disableDbCheck: true             // Skip automatic table creation (if already created db and table)
//});

//// =======================
//// Express session middleware (all options explained)
//// =======================
//app.use(session({
//    store: sessionStore,                // Session store instance
//    secret: 'my-secret-key',            // Secret for signing session ID cookie
//    name: 'connect.sid',                // Cookie name used to store session ID
//    resave: false,                      // Avoid saving session if it wasn’t modified
//    saveUninitialized: true,            // Save new sessions even if they are empty
//    rolling: false,                     // Do not reset cookie expiration on every response
//    unset: 'destroy',                   // Remove session from store when req.session = null
//    proxy: false,                        // Set true if behind reverse proxy
//    genid: () => `sess-${Date.now()}-${Math.random()}`, // Custom session ID generator
//    cookie: {
//        maxAge: 30 * 60 * 1000,         // 30 minutes in milliseconds
//        httpOnly: true,                  // Prevent JS access to cookie
//        secure: true,                    // Send cookie only over HTTPS
//        sameSite: 'lax',                 // CSRF protection
//        path: '/',                        // Path for cookie
//        signed: true,                    // Sign the cookie to detect tampering
//        priority: 'medium',              // Cookie priority for browser (low, medium, high)
//        overwrite: false,                // Don’t overwrite existing cookies
//        encode: String                   // Optional encoding function
//    }
//}));

//// =======================
//// Middleware to attach session info
//// =======================
//app.use((req, res, next) => {
//    req.session.lastAccess = Date.now();                                         // Store last access timestamp
//    req.session.userId = req.session.userId || Math.floor(Math.random() * 1000); // Example user ID
//    req.session.role = req.session.role || 'guest';                              // Default role stored in session
//    next();
//});

//// =======================
//// Log active sessions
//// =======================
//function logActiveSessions() {
//    sessionStore.db.all("SELECT * FROM sessions", [], (err, rows) => {
//        if (err) return console.error("Error fetching sessions:", err);
//        //console.log(`\nActive sessions (${rows.length}):`);
//        for (const row of rows) {
//            let sess = {};
//            try { sess = JSON.parse(row.sess); } catch { }
//           /* console.log({
//                sid: row.sid,                   // Session ID
//                lastAccess: sess.lastAccess,    // Last access timestamp
//                userId: sess.userId,            // User ID stored in session
//                role: sess.role,                // Role stored in session
//                cookie: sess.cookie || {}       // Cookie info stored in session
//            });
//            */
//        }
//    });
//}
//// =======================
//// Initialize Queue and API Request Queue Processor
//// =======================
//const queue = new Queue()
//const qu_processor = new que_processor(queue) 
//qu_processor.start()

//// =======================
//// Routes
//// =======================
//app.get('/api/users', (req, res) => {
//    try {
//        const headers = new Headers(req.headers)
//        queue.enqueue(headers)
//        console.log(queue.size())
//        //console.log(JSON.stringify(queue.dequeue(), null, 2));

//        const users = usersDb.prepare('SELECT * FROM users').all(); // Fetch users
//        logActiveSessions();                                        // Print session info
//        res.json(users);
//    } catch (err) {
//        console.error(err);
//        res.status(500).json({ error: 'DB error' });
//    }
//});

//app.get('/api/logSessions', (req, res) => {
//    logActiveSessions();
//    res.json({ message: 'Active sessions logged' });
//});

//app.get('/api/test/:operation', (req, res) => {
//    try {
//        const { operation } = req.params;

//        // Example: decide operation
//        let query;
//        switch (operation) {
//            case 'add':
//                console.log("new add");
//                query = 'SELECT 1 + 1 AS result';
//                break;
//            case 'multiply':
//                query = 'SELECT 2 * 3 AS result';
//                break;
//            default:
//                return res.status(400).json({ error: 'Unknown operation' });
//        }

//        const result = usersDb.prepare(query).get();
//        res.json(result);
//    } catch (err) {
//        console.error(err);
//        res.status(500).json({ error: 'DB error' });
//    }
//});

//// 404 fallback
//app.use((req, res) => res.status(404).json({ error: 'Not found' }));

//// =======================
//// Start HTTPS server
//// =======================
//// Wrap Express app for HTTP/2
//const http2App = http2Express(app);

//(async () => {
//    const httpsOptions = await getHttpsOptions();

//    // Create native HTTP/2 server with Express app
//    const server = http2.createSecureServer(httpsOptions, http2App);

//    server.listen(443, '0.0.0.0', () => {
//        console.log('HTTP/2 Express server running on port 443');
//    });
//})();
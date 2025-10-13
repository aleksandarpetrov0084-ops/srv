
//"host": "localhost",
//"connection": "keep-alive",
//"cache-control": "max-age=0",
//"sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Brave\";v=\"140\"",
//"sec-ch-ua-mobile": "?0",
//"sec-ch-ua-platform": "\"Windows\"",
//"upgrade-insecure-requests": "1",
//"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
//"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*; q = 0.8",
//"sec-gpc": "1",
//"accept-language": "en-US,en;q=0.9",
//"sec-fetch-site": "none",
//"sec-fetch-mode": "navigate",
//"sec-fetch-user": "?1",
//"sec-fetch-dest": "document",
//"accept-encoding": "gzip, deflate, br, zstd",
//"cookie": "connect.sid=s%3Asess-1759936503121-0.8102783185084643.AoOUVznnompW%2F7JQE%2FFqUogz3vdP%2FWdazqYb%2FawOVOw"
class Headers {
    constructor(req_headers = {}) {
        this.headers = {};
        for (const key in req_headers) {
            this.headers[key.toLowerCase()] = req_headers[key];
        }
    }
    get(name) {return this.headers[name.toLowerCase()];}
}

export const client = {
    host: 'host',
    connection: 'connection',
    cache_control: 'cache-control',
    sec_ch_ua: 'sec-ch-ua',
    sec_ch_ua_mobile: 'sec-ch-ua-mobile',
    sec_ch_ua_platform: 'sec-ch-ua-platform',
    upgrade_insecure_requests: 'upgrade-insecure-requests',
    user_agent: 'user-agent',
    accept: 'accept',
    sec_gpc: 'sec-gpc',
    accept_language: 'accept-language',
    sec_fetch_site: 'sec-fetch-site',
    sec_fetch_mode: 'sec-fetch-mode',
    sec_fetch_dest: 'sec-fetch-dest',
    accept_encoding: 'accept-encoding',
};

export default Headers;

//host: The domain name (and optionally port) of the server being requested.
//connection: Options for the TCP connection. 'keep-alive' keeps the connection open for multiple requests.
//cache-control: Directives for caching. 'max-age=0' requests fresh content, not cached.
//sec-ch-ua: Browser brand and version (User-Agent Client Hints).
//sec-ch-ua-mobile: Indicates if the client is mobile. '?0' = not mobile, '?1' = mobile.
//sec-ch-ua-platform: Platform/OS of the client, e.g., 'Windows', 'macOS'.
//upgrade-insecure-requests: Client prefers HTTPS. '1' signals upgrade HTTP to HTTPS.
//user-agent: Classic user agent string identifying browser, engine, OS, and version.
//accept: MIME types the client can handle, e.g., 'text/html', 'application/xml', 'image/*'.
//sec-gpc: Global Privacy Control. '1' signals user prefers privacy (e.g., do-not-sell).
//accept-language: Preferred languages for content, e.g., 'en-US,en;q=0.9'.
//sec-fetch-site: Relationship between initiator and target: 'same-origin', 'cross-site', 'none'.
//sec-fetch-mode: Request handling mode: 'navigate', 'cors', etc.
//sec-fetch-user: Indicates user activation: '?1' if triggered by click/user action.
//sec-fetch-dest: Destination type of the request: 'document', 'image', 'script', etc.
//accept-encoding: Compression algorithms the client supports: 'gzip', 'deflate', 'br', 'zstd'.
//cookie: Cookies sent by client: session IDs, auth tokens, preferences, etc.

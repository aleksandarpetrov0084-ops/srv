
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

    get(name) {
        return this.headers[name.toLowerCase()];
    }
}

export default Headers;

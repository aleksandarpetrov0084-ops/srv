
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';  

export  function currentRequestHeadersHashed(headers, hasher = 'sha512') {
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

export async function getHttpsOptions() {
    const key = await fs.readFile(path.join(process.cwd(), 'key', 'key.pem'));
    const cert = await fs.readFile(path.join(process.cwd(), 'cert', 'cert.pem'));
    return { key, cert };
}



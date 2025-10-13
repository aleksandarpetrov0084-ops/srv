# This is my first https server
Main idea is to have a server that is really configurable and modular

Iniating client connection
| Phase                 | Protocol      | Example Packet Types               |
| --------------------- | ------------- | ---------------------------------- |
| Name resolution       | DNS (UDP/TCP) | DNS query/response                 |
| Connection setup      | TCP           | SYN, SYN-ACK, ACK                  |
| Encryption setup      | TLS 1.3       | ClientHello, ServerHello, Finished |
| Protocol negotiation  | ALPN          | “h2” negotiated inside TLS         |
| Data exchange         | HTTP/2        | SETTINGS, HEADERS, DATA frames     |
| Transport reliability | TCP           | ACKs, retransmissions              |

Start-Process node -ArgumentList "https.js" starts seever in a seperate window
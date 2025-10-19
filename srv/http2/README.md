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

wrkr_type
wrkr_type_service

msgs_processor_db   a worker to handle db read/writes belongs to msgs_processor
- rules how to handle each type of message, in msgs_processor instance for switch case with methods
- you pass in the message and it is taken care of it
crypto_processor_db   a worker to handle db read/writes belongs to msgs_processor
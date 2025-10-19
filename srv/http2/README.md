# This is my first http2 server
Main idea is to have very moduler non blockin http2 server that handles request in message fashion

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
-> means passing Msg to workers for processing
WORKER -> PROCESSOR -> RULES/HANDLERS normal structure
WORKER -> PROCESSOR -> RULES/HANDLERS -> WORKER -> PROCESSOR -> RULES/HANDLERS   Can have other workers with their own processor logic 
1. Type worker 
- initialize processor, pass it a msgs queue and you listen for msgs. 
- Every worker has a logger.
- Can have other workers with their own processor logic 
2. Type processor 
- is where you process the msgs based on rules or handlers (you pass the mesage and it routes it)
- Every proecssor can have other worker with their own processor logic
- You dont need a logger here 

wrkr_type_service

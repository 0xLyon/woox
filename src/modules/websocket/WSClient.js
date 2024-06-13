require('dotenv').config();
const WebSocket = require('ws');
const cryptoJS = require('crypto-js');
const applicationId = process.env.APPLICATION_ID;
const timestamp = Date.now();

class WebSocketClient {
    constructor(url) {
        this.wsUrl = `${url}/${applicationId}`;
        this.ws = new WebSocket(this.wsUrl);
        this.connectionOpen = false;
        this.messageQueue = [];
        this.setupHandlers();
    }

    setupHandlers() {
        this.ws.on('open', () => {
            console.log('Connected to the WebSocket server');
            this.connectionOpen = true;
            this.flushMessageQueue();
        });

        this.ws.on('message', (data) => {
            const message = JSON.parse(data.toString());
            if (message.event === 'ping') {
                console.log(`--------------\nServer Ping - ${message.ts}\n--------------`);
                return;
            }
            else if (message.event === 'pong') {
                console.log(`--------------\nServer Pong - ${message.ts}\n--------------`);
                return;
            } else {
                console.log(`--------------\nData Received - ${message.ts}\n--------------\n`, JSON.stringify(message, null, 2));
            }
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        this.ws.on('close', (code, reason) => {
            console.log(`Connection closed. Code: ${code}, Reason: ${reason}`);
            this.connectionOpen = false;
            this.stopPing();
        });
    }

    flushMessageQueue() {
        while (this.messageQueue.length > 0 && this.connectionOpen) {
            const message = this.messageQueue.shift();
            this.ws.send(message);
        }
    }

    sendMessage(message) {
        const messageStr = JSON.stringify(message);
        if (this.connectionOpen) {
            this.ws.send(messageStr);
        } else {
            this.messageQueue.push(messageStr);
        }
    }

    authenticate(clientId, apiKey, secretKey) {
        const authMessage = {
            id: clientId,
            event: 'auth',
            params: {
                apikey: apiKey,
                sign: cryptoJS.HmacSHA256(`|${timestamp}`, secretKey).toString(),
                timestamp: timestamp
            }
        };

        return new Promise((resolve, reject) => {
            this.ws.on('message', (data) => {
                const message = JSON.parse(data.toString());
                if (message.event === 'auth' && message.success === true) {
                    console.log('Authentication successful');
                    resolve();
                } else if (message.event === 'auth' && message.success === false) {
                    console.error('Authentication failed:', message.reason);
                    reject(new Error(message.reason));
                }
            });

            this.sendMessage(authMessage);
            console.log('Sent authentication message');
        });
    }

    startPing() {
        this.pingInterval = setInterval(() => {
            const pingMessage = {
                event: 'ping'
            };
            this.sendMessage(pingMessage);
            console.log(`--------------\nClient Ping - ${timestamp}\n--------------`);
        }, 10000);
    }

    stopPing() {
        clearInterval(this.pingInterval);
        console.log('Stopped sending ping messages');
    }

    subscribe(clientId, topic) {
        const subscriptionMessage = {
            id: clientId,
            topic: topic,
            event: 'subscribe'
        };
        this.sendMessage(subscriptionMessage);
        console.log(`Subscribed to ${topic} with client ID: ${clientId}`);
    };
}

module.exports = WebSocketClient;

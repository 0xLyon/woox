const WebSocketClient = require('./WSClient');
const { wsPubStagURL } = require('../constants');

const client = new WebSocketClient(wsPubStagURL);

client.startPing();
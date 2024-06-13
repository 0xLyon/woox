require('dotenv').config();
const cryptoJS = require('crypto-js');
const axios = require('axios');
const { apiBaseURL, endpoint_SendOrder } = require('../constants');
const method = 'POST';
const url = apiBaseURL + endpoint_SendOrder;
const xApiTimestamp = Date.now();
const secretKey = process.env.API_SECRET;
const apiKey = process.env.API_KEY;

async function CreateOrder() {

    // Configurable Parameters
    const [symbol, client_order_id, order_tag, order_type, order_price, order_quantity, order_amount, reduce_only, visible_quantity, side, position_side] = [
        "SPOT_WOO_USDT",        // REQ: Y | Symbol: <TYPE>_<BASE>_<QUOTE>
        "",                     // REQ: N | Client Order ID: Number for scope from 0 to 9223372036854775807. (default: 0)
        "",                     // REQ: N | Order Tag: An optional tag for this order. (default: default)
        "MARKET",               // REQ: Y | Type: LIMIT/MARKET/IOC/FOK/POST_ONLY/ASK/BID
        "",                     // REQ: N | Price: If order_type is MARKET, then is not required, otherwise this parameter is required.
        "",                     // REQ: N | Quantity: For MARKET/ASK/BID order, if order_amount is given, it is not required.
        "1",                    // REQ: N | Amount: For MARKET/ASK/BID order, the order size in terms of quote currency
        "",                     // REQ: N | Reduce Only: TRUE/FALSE, default false. If the user's RO order message contains 50 pending orders,the order can be created successfully placed.
        "",                     // REQ: N | Visible Quantity: The order quantity shown on orderbook. (default: equal to order_quantity)
        "BUY",                  // REQ: Y | Side: SELL/BUY 
        ""                      // REQ: N | Position Side: SHORT/LONG, If position mode is HEDGE_MODE and the trading involves futures,then is required, otherwise this parameter is not required.
    ];

    let jsonObj = {};
    // Adds the populated parameters parameters to the JSON object
    if (symbol) jsonObj.symbol = symbol;
    if (client_order_id) jsonObj.client_order_id = client_order_id;
    if (order_tag) jsonObj.order_tag = order_tag;
    if (order_type) jsonObj.order_type = order_type;
    if (order_price) jsonObj.order_price = order_price;
    if (order_quantity) jsonObj.order_quantity = order_quantity;
    if (order_amount) jsonObj.order_amount = order_amount;
    if (reduce_only) jsonObj.reduce_only = reduce_only;
    if (visible_quantity) jsonObj.visible_quantity = visible_quantity;
    if (side) jsonObj.side = side;
    if (position_side) jsonObj.position_side = position_side;

    const params = JSON.stringify(jsonObj);
    const body = JSON.parse(params);
    const queryString = Object.keys(body)
        .sort()
        .map(key => `${key}=${body[key]}`)
        .join('&');
    const signString = `${queryString}|${xApiTimestamp}`;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-api-key': apiKey,
        'x-api-signature': cryptoJS.HmacSHA256(signString, secretKey).toString(),
        'x-api-timestamp': xApiTimestamp,
        'cache-control': 'no-cache'
    };

    const options = { method: method, headers: headers, data: body };
    await SendOrder(url, options);
}

async function SendOrder(url, options) {

    try {
        const response = await axios(url, options)
            .then(
                function (response) {
                    const data = response.data

                    function iterateObject(obj, parentKey = '') {
                        for (const [key, value] of Object.entries(obj)) {
                            const fullKey = parentKey ? `${parentKey}.${key}` : key;
                            if (value && typeof value === 'object' && !Array.isArray(value)) {
                                iterateObject(value, fullKey);
                            } else {
                                console.log(`${fullKey}:`, value);
                            }
                        }
                    }
                    iterateObject(data);
                })

        return response;

    } catch (error) {
        console.log(error.response.data)
    }
}

CreateOrder()
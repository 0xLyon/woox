require('dotenv').config();
const cryptoJS = require('crypto-js');
const axios = require('axios');
const { apiBaseURL, endpoint_SendAlgoOrder } = require('../constants');
const method = 'POST';
const url = apiBaseURL + endpoint_SendAlgoOrder;
const xApiTimestamp = Date.now();
const secretKey = process.env.API_SECRET;
const apiKey = process.env.API_KEY;

async function CreateOrder() {

    // Configurable Parameters
    const [activatedPrice, algoType, callbackRate, callbackValue, childOrders, symbol, clientOrderId, orderTag, price, quantity, reduceOnly, triggerPrice, triggerPriceType, type, visibleQuantity, side, positionSide,] = [
        "",                     // REQ: N | Activated Price: Activated price for algoType = TRAILING_STOP
        "STOP",                 // REQ: Y | Algo Type: STOP/OCO/TRAILING_STOP/BRACKET
        "",                     // REQ: N | Callback Rate: Only for algoType=TRAILING_STOP, i.e. the value = 0.1 represent to 10%.
        "",                     // REQ: N | Callback Value: Only for algoType=TRAILING_STOP, i.e. the value = 100
        "",                     // REQ: N | Child Orders: Only for algoType=POSITIONAL_TP_SL
        "SPOT_WOO_USDT",        // REQ: Y | Symbol: <TYPE>_<BASE>_<QUOTE>
        "",                     // REQ: N | Client Order ID: Defined by client,number for scope : from 0 to 9223372036854775807. (default: 0), duplicated client order id on opening order is not allowed.
        "",                     // REQ: N | Order Tag: An optional tag for this order. (default: default)
        "",                     // REQ: N | Price: Order Price
        "1",                    // REQ: N | Order Quantity: Only optional for algoType=POSITIONAL_TP_SL
        "",                     // REQ: N | Reduce Only: TRUE/FALSE, default false. If the user's RO order message contains 50 pending orders,the order can be created successfully placed.
        "1.4",                  // REQ: N | Trigger Price: If algoType=TRAILING_STOP, you need to provide 'activatedPrice'
        "",                     // REQ: N | Trigger Price Type: Default MARKET_PRICE, enum: MARKET_PRICE
        "MARKET",               // REQ: Y | Type: LIMIT/MARKET
        "",                     // REQ: N | Visible Quantity: The order quantity shown on orderbook. (default: equal to orderQuantity)
        "SELL",                 // REQ: Y | Side: SELL/BUY 
        ""                      // REQ: N | Position Side: SHORT/LONG, If position mode is HEDGE_MODE and the trading involves futures,then is required, otherwise this parameter is not required.
    ];

    let jsonObj = {};
    // Add keys and values to the object only if the value is not empty
    if (activatedPrice) jsonObj.activatedPrice = activatedPrice;
    if (algoType) jsonObj.algoType = algoType;
    if (callbackRate) jsonObj.callbackRate = callbackRate;
    if (callbackValue) jsonObj.callbackValue = callbackValue;
    if (childOrders) jsonObj.childOrders = childOrders;
    if (symbol) jsonObj.symbol = symbol;
    if (clientOrderId) jsonObj.clientOrderId = clientOrderId;
    if (orderTag) jsonObj.orderTag = orderTag;
    if (price) jsonObj.price = price;
    if (quantity) jsonObj.quantity = quantity;
    if (reduceOnly) jsonObj.reduceOnly = reduceOnly;
    if (triggerPrice) jsonObj.triggerPrice = triggerPrice;
    if (triggerPriceType) jsonObj.triggerPriceType = triggerPriceType;
    if (type) jsonObj.type = type;
    if (visibleQuantity) jsonObj.visibleQuantity = visibleQuantity;
    if (side) jsonObj.side = side;
    if (positionSide) jsonObj.positionSide = positionSide;

    const params = JSON.stringify(jsonObj);
    const body = JSON.parse(params);
    const signString = `${xApiTimestamp}${method}${endpoint_SendAlgoOrder}${params}`;
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-api-signature': cryptoJS.HmacSHA256(signString, secretKey).toString(),
        'x-api-timestamp': xApiTimestamp,
        'cache-control': 'no-cache'
    };

    const options = { method: method, headers: headers, data: body };
    await SendAlgoOrder(url, options);

}

async function SendAlgoOrder(url, options) {

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

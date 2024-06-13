require('dotenv').config();
const cryptoJS = require('crypto-js');
const axios = require('axios');
const { apiBaseURL, endpoint_GetBalance } = require('../constants');
const method = 'GET';
const url = apiBaseURL + endpoint_GetBalance;
const xApiTimestamp = Date.now();
const secretKey = process.env.API_SECRET;
const apiKey = process.env.API_KEY;

async function CreateGetBalance() {

    const queryString = `${xApiTimestamp}${method}${endpoint_GetBalance}`;
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-api-signature': cryptoJS.HmacSHA256(queryString, secretKey).toString(),
        'x-api-timestamp': xApiTimestamp,
        'cache-control': 'no-cache'

    };
    const options = { method: method, headers: headers };
    await GetBalance(url, options);
}

async function GetBalance(url, options) {

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

CreateGetBalance()

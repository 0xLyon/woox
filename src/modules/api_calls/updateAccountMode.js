require('dotenv').config();
const cryptoJS = require('crypto-js');
const axios = require('axios');
const { apiBaseURL, endpoint_UpdateAccountMode } = require('../constants');
const method = 'POST';
const url = apiBaseURL + endpoint_UpdateAccountMode;
const xApiTimestamp = Date.now();
const secretKey = process.env.API_SECRET;
const apiKey = process.env.API_KEY;

//Configurable Parameters
const accountMode = "FUTURES" // Account mode can be updated to: PURE_SPOT/MARGIN/FUTURES

async function UpdateAccountMode() {

    const params = `{"account_mode": "${accountMode}"}`;
    const body = JSON.parse(params);
    const sortedParams = Object.keys(body)
        .sort()
        .map(key => `${key}=${body[key]}`)
        .join('&');
    const queryString = `${sortedParams}|${xApiTimestamp}`;

    const signString = cryptoJS.HmacSHA256(queryString, secretKey).toString();
    const headers = {
        "Content-Type": 'application/x-www-form-urlencoded',
        "x-api-key": apiKey,
        "x-api-signature": signString,
        "x-api-timestamp": xApiTimestamp,
        "cache-control": 'no-cache'
    };

    const options = { method: method, headers: headers, data: body };
    await UpdateAccount(url, options);

    async function UpdateAccount(url, options) {

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
}

UpdateAccountMode()

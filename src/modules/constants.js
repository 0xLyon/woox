const apiBaseURL = 'https://api.woo.org';
const wsPubStagURL = 'wss://wss.staging.woo.org/ws/stream';
const wsPubProdURL = 'wss://wss.woo.org/ws/stream';
const wsPrivStagURL = 'wss://wss.staging.woo.org/v2/ws/private/stream'
const wsPrivProdURL = 'wss://wss.woo.org/v2/ws/private/stream'
const endpoint_GetAvailableSymbols = '/v1/public/info/';
const endpoint_GetSystemInfo = '/v1/public/system_info/';
const endpoint_GetBalance = '/v3/balances/';
const endpoint_UpdateAccountMode = '/v1/client/account_mode/';
const endpoint_SendOrder = '/v1/order/';
const endpoint_SendAlgoOrder = '/v3/algo/order';

module.exports = {
    apiBaseURL,
    wsPubStagURL,
    wsPubProdURL,
    wsPrivStagURL,
    wsPrivProdURL,
    endpoint_GetAvailableSymbols,
    endpoint_GetSystemInfo,
    endpoint_GetBalance,
    endpoint_UpdateAccountMode,
    endpoint_SendOrder,
    endpoint_SendAlgoOrder
};
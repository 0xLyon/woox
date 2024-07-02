# WOOX API & WebSocket

This project interfaces with WOOX's API and Websocket using JavaScript

## Table of Contents

- [WOOX API \& WebSocket](#woox-api--websocket)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Features](#features)
  - [Usage](#usage)
    - [API Calls](#api-calls)
    - [WebSocket](#websocket)


## Installation

1. Clone the repository:
```bash
git clone https://github.com/0xLyon/woox.git
```
2. Change directory into the project directory:
```bash
cd woox
```
3. Install dependancies
```bash
npm install
```
4. Populate your API_SECRET, API_KEY and APPLICATION_ID in the .env file to be used as environment variables\
(*Can be found via your WooX account - https://x.woo.org/en/account/sub-account*)
```bash
vi .env
```

## Features

This projects allows the following API calls to be actioned:

1. Get System Status
2. Get Account Balance
3. Get Available Symbols
4. Update Account Mode
5. Send Order
6. Send Algo Order

It also allows the following WebSocket functions:

1. Ping (Keep Alive)
2. Subscribe (Public Endpoints)
3. Authenticate and Subscribe (Private Endpoints)

## Usage

### API Calls
To use the the API calls available, you can run the scripts for each, as detailed below, from the root directory:
- Get System Status: `npm run api_system`
- Get Account Balance: `npm run api_balance`
- Get Available Symbols: `npm run api_symbols`
- Update Account Mode: `npm run api_updateAccount`*
- Send Order: `npm run api_sendOrder`*
- Send Algo Order: `npm run api_sendAlgoOrder`*

**NOTE** *The API Calls marked, have "Configurable Parameters" that can be configured in their respective .js files* 

### WebSocket
To use the Websocket functions available, you can run the scripts for each, as detailed below, from the root directory:
- Ping (Keep Alive): `npm run ws_ping`
- Subscribe (Public Endpoints): `npm run ws_sub`*
- Authenticate and Subscribe (Private Endpoints): `npm run ws_authSub`*

**NOTE** *The WebSocket functions marked, have "Configurable Parameters" that can be configured in their respective .js files.* 
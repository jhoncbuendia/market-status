// Documentation https://bittrex.github.io/api/v3#operation--markets--marketSymbol--orderbook-get
const signalR = require('signalr-client');
const zlib = require('zlib');
const crypto = require('crypto');
const uuid = require('uuid');

const url = 'wss://socket-v3.bittrex.com/signalr';
const hub = ['c3'];

const apikey = '';
const apisecret = '';

var client;
var resolveInvocationPromise = () => {
};

let io;

async function main() {
    client = await connect();
    if (apisecret) {
        await authenticate(client);
    } else {
        console.log('Authentication skipped because API key was not provided')
    }
    await subscribe(client);
}

async function connect() {
    return new Promise((resolve) => {
        const client = new signalR.client(url, hub);
        client.serviceHandlers.messageReceived = messageReceived;
        client.serviceHandlers.connected = () => {
            console.log('Connected');
            return resolve(client)
        }
    });
}

async function authenticate(client) {
    const timestamp = new Date().getTime()
    const randomContent = uuid.v4()
    const content = `${timestamp}${randomContent}`
    const signedContent = crypto.createHmac('sha512', apisecret)
        .update(content).digest('hex').toUpperCase()

    const response = await invoke(client, 'authenticate',
        apikey,
        timestamp,
        randomContent,
        signedContent);

    if (response['Success']) {
        console.log('Authenticated');
    } else {
        console.log('Authentication failed: ' + response['ErrorCode']);
    }
}

async function subscribe(client) {
    const channels = [
        // 'heartbeat',
        // 'trade_BTC-USD',
        // 'balance',
        'orderbook_BTC-USD_25'
    ];
    const response = await invoke(client, 'subscribe', channels);

    for (var i = 0; i < channels.length; i++) {
        if (response[i]['Success']) {
            console.log('Subscription to "' + channels[i] + '" successful');
        } else {
            console.log('Subscription to "' + channels[i] + '" failed: ' + response[i]['ErrorCode']);
        }
    }
}

async function invoke(client, method, ...args) {
    return new Promise((resolve, reject) => {
        resolveInvocationPromise = resolve; // Promise will be resolved when response message received

        client.call(hub[0], method, ...args)
            .done(function (err) {
                if (err) {
                    return reject(err);
                }
            });
    });
}

function messageReceived(message) {
    const data = JSON.parse(message.utf8Data);
    if (data['R']) {
        resolveInvocationPromise(data.R);
    } else if (data['M']) {
        data.M.forEach(function (m) {
            if (m['A']) {
                if (m.A[0]) {
                    const b64 = m.A[0];
                    const raw = new Buffer.from(b64, 'base64');

                    zlib.inflateRaw(raw, function (err, inflated) {
                        if (!err) {
                            const json = JSON.parse(inflated.toString('utf8'));
                            io.local.emit("onReceiveNewOrder", json);
                            console.log(m.M + ': ');
                            console.log(json);
                        }
                    });
                } else if (m.M == 'heartbeat') {
                    console.log('\u2661');
                } else if (m.M == 'authenticationExpiring') {
                    console.log('Authentication expiring...');
                    authenticate(client);
                }
            }
        });
    }
}

function init(server) {
    io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        main();
    })
}

exports.init = init;
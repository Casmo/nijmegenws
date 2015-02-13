/**
 * Global settings
 * @type {{port: number}}
 */
var settings = {
    port: 1234
};

var WebSocketServer = require("websocket").server;
var http = require("http");

var server = http.createServer(function (request, response) {});
server.listen(settings.port, function () {});
var wsServer = new WebSocketServer({
    httpServer: server
});

/**
 * List of all connected clients
 * @type {Array}
 */
var clients = [];
var clientID = 1;

/**
 * Logical after a new client connected to the websocket server
 */
wsServer.on("request", function (request) {

    // Client connected
    console.log('> Client connected');
    var client = {
        name: 'Client ' + clientID++,
        connection: {}
    };
    var connection = request.accept(null, request.origin);
    connection.client = client;
    client.connection = connection;
    client.connection.on("message", function (message) {
        var data = JSON.parse(message.utf8Data);
        console.log('> message received.', data);
        var json = {
            topic: 'message',
            data: {
                message: client.name + ': ' + data.data.message
            }
        };
        connection.send(JSON.stringify(json));
    });
    client.connection.on("close", function (connection) {
        disconnectClient(this.client);
    });
    clients.push(client);

});

/**
 * Disconnect client from the server and remove it from the clients array.
 * @param client object
 */
function disconnectClient(client) {

    console.log('> Client disconnected');
    clients.slice(clients.indexOf(client), 1);

}
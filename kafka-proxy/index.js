'use strict';

var kafkaConnection = '131.159.30.173:9092/'
var publicProxyPort = 9999;
var internalKafkaProxyPort = 9998;


var KafkaProxy = require('kafka-proxy');

var kafkaProxy = new KafkaProxy({
    wsPort: internalKafkaProxyPort,
    kafka: kafkaConnection,
});

kafkaProxy.listen();

var kafkaProxyMap = {};
var clientTopicMap = {};

var url = require('url');
var ws = require("nodejs-websocket")
var server = ws.createServer(function (conn) {
    var params = url.parse("http://0.0.0.0/" + conn.path, true).query;
    console.log("New Connection ("+conn.socket.remoteAddress+"): " + JSON.stringify(params) );
    if (!params.topic)
        conn.close(1000, "NO kafka-topic!!");
    else {
        if (!clientTopicMap[params.topic]) {
            clientTopicMap[params.topic] = [];
            var conn = ws.connect("ws://localhost:" + internalKafkaProxyPort + "/?topic=" + params.topic + "&offset=0")
            conn.on("text", function (msg) {
                clientTopicMap[params.topic].forEach(function (conn) {
                    conn.sendText(msg)
                })
            })
        }
        clientTopicMap[params.topic].push(conn);

        conn.on("close", function (code, reason) {
            clientTopicMap[params.topic].splice(clientTopicMap[params.topic].indexOf(conn), 1);
        })
        conn.on("error", function (error) {
        })
    }

}).listen(publicProxyPort);

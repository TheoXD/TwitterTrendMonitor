const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const Twitter = require('twitter');

const FormData = require('form-data');
var fs = require('fs');
const fetch = require('cross-fetch');



class TwitterProxy {
    constructor(args) {
        this.stream = null;
        this.socket = null;
        this.show_retweets = false;

        this.active_connections = [];
        this.connections = {};

        this.InitServer(args.port);
    }

    InitTwitter() {
        this.twitter = new Twitter({
            consumer_key: "",
            consumer_secret: "",
            access_token_key: "",
            access_token_secret: ""
        });

        this.socketio.on("connection", _socket => {

            console.info("client connected");

            this.connections[_socket.id] = _socket;
            this.active_connections.push(_socket.id);

            if(this.active_connections.length > 0) {
                this.StartStream();
            }

            _socket.on("connection", () => {
            });

            /*
            _socket.on("set_filter", _filter => {
                console.info("filter: " + _filter);
                this.app.locals.filter = _filter;
                this.RestartStream();
            });
            */

            _socket.on("disconnect", () => {
                console.info("client disconnected");

                this.connections[_socket.id] = null;
                this.active_connections.splice(this.active_connections.indexOf(_socket.id), 1);

                if(this.active_connections.length == 0) {
                    this.DestroyStream();
                }

                _socket.disconnect()
            });
        });

        console.info("twitter proxy initialized");
    
    }

    RestartStream() {
        this.DestroyStream();
        this.StartStream();
    }

    StartStream() {
        this.doStream();
    }

    DestroyStream() {
        this.stream.destroy();
    }

    InitServer(_port) {
        const port = _port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.socketio = socketio(this.server);

        this.app.use(bodyParser.json());

        this.app.locals.filter = 'Bowsette';

        this.server.listen(_port, () => {
            console.info("server initialized");
            this.InitTwitter();
        });
    }


    broadcastTweet(_tweet) {
        //if (_tweet && _tweet.text && _tweet.text.includes('RT')) return; //Ignore retweets
        if(_tweet.retweeted && !this.show_retweets) return;
        this.active_connections.forEach(connection_id => {
            var socket = this.connections[connection_id];
            socket.emit("tweets", _tweet);
        });
    }

    doStream() {
        console.info("do stream");
        this.twitter.stream('statuses/filter', { track: this.app.locals.filter }, (_stream) => {
            _stream.on('data', (tweet) => {
                console.info(tweet);
                this.broadcastTweet(tweet);
            });
        
            this.stream = _stream;
        });
    }

}

let proxy = new TwitterProxy({port: 8081});



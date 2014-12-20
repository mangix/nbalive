/**
 * Live Scene
 * */

var util = require("util");
var Scene = require("../scene");
var _ = require("underscore");
var Grid = require("term-grid");

var ChannelFactory = require("../channel_factory");

var Load = require("../util").animateLoad;

var LiveScene = module.exports = function (channelName, gameInfo) {
    Scene.call(this);
    this.gameInfo = gameInfo;
    this.channelName = channelName;

    this.typing = false;
    this.initGrid();
    this.initChannel();
    require("keypress")(process.stdin);
    this.onKeyPress = this.onKeyPress.bind(this);
};

util.inherits(LiveScene, Scene);

_.extend(LiveScene.prototype, {
    onKeyPress: function (ch, key) {
        if (ch == "/") {
            this.stopLoading();
            this.typing = true;
            process.stdout.write("/");
        }
        if (key) {
            switch (key.name) {
                case 'c':
                    key.ctrl && process.exit(0);
                    break;
            }
        }
    },
    initGrid: function () {
        var grid = this.grid = new Grid();
        grid.setWidth([8, 20]);
        grid.setColor(1, "green");
    },
    initChannel: function () {
        var channel = this.channel = ChannelFactory.create(this.channelName, this.gameInfo);
        var grid = this.grid;
        var gameInfo = this.gameInfo;
        var self = this;
        channel.on('data', function (res) {
            self.stopLoading();
            res.forEach(function (data) {
                grid.appendRow([data.time || "", data.score ? gameInfo.host + " " + data.score + " " + gameInfo.visiting : "", (data.team || "") + data.content], true);
            });
            if (!self.typing) {
                self.loading();
            }
        });

        channel.on("over", function () {
            Load.stop();
            process.stdout.write("game over \n");
        });

        channel.on("error", function () {
            process.stdout.write("connection error, retry... \n");
        });
    },
    start: function () {
        var self = this;
        this.loading();
        this.channel.startLive();
        process.stdin.on('keypress', this.onKeyPress);
        process.stdin.on("data", function () {
            self.typing = false;
        })
    },
    stop: function () {
        this.channel.stopLive();
        process.stdin.removeListener("keypress", this.onKeyPress);
        Load.stop();
    },
    loading: function () {
        process.stdin.setRawMode(true);
        Load.start();
    },
    stopLoading: function () {
        Load.stop();
        process.stdin.setRawMode(false);
    }
});
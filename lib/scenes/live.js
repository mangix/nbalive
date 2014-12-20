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

    this.initGrid();
    this.initChannel();
};

util.inherits(LiveScene, Scene);

_.extend(LiveScene.prototype, {
    initGrid: function () {
        var grid = this.grid = new Grid();
        grid.setWidth([8, 20]);
        grid.setColor(1, "green");
    },
    initChannel: function () {
        var channel = this.channel = ChannelFactory.create(this.channelName, this.gameInfo);
        var grid = this.grid;
        var gameInfo = this.gameInfo;
        channel.on('data', function (res) {
            Load.stop();
            res.forEach(function (data) {
                grid.appendRow([data.time || "", data.score ? gameInfo.host + " " + data.score + " " + gameInfo.visiting : "", (data.team || "") + data.content], true);
            });
            Load.start();
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
        process.stdin.setRawMode(false);
        this.channel.startLive();
        Load.start();
        process.stdin.on('data',function(){
            Load.stop()
        })
    },
    stop: function () {
        this.channel.stopLive();
    }
});
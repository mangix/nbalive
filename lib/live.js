var schedule = require("./remote/schedule");
var List = require("./list");
var ChannelFactory = require("./channel_factory");
var cell = require('./util').cell;
var getStatistic = require("./remote/statistic");
var Grid = require("term-grid");

var gameMap = {};
var cacheGame = function (games) {
    games.forEach(function (game) {
        gameMap[game.id] = game;
    });
};

module.exports = function (channel, date) {
    schedule(channel, date, function (error, games) {
        if (error) {
            console.log(error);
            return;
        }

        var list = List(games);
        list.start();

        cacheGame(games);

        list.on('keypress', function (key, item) {
            if (key.name == "return") {
                var gameInfo = gameMap[item];
                switch (gameInfo.status) {
                    case 1:
                        list.stop();
                        live(gameInfo);
                        break;
                    case 2:
                        list.stop();
                        statistic(gameInfo);
                        break;
                }
            }
        });
    });


    function live(gameInfo) {
        process.stdin.setRawMode(false);
        var liveChannel = ChannelFactory.create(channel, gameInfo);
        liveChannel.startLive();
        liveChannel.on('data', function (data) {
            process.stdout.write(cell(data.time || "", 8) + " \033[0;34m " + cell(data.score || "", 10) + "\033[0m " + data.content + "\n");
        });

        liveChannel.on("over", function () {
            process.stdout.write("game over \n");
        });

        liveChannel.on("error", function () {
            process.stdout.write("connection error, retry... \n");
        });
    }

    function statistic(gameInfo) {
        getStatistic(gameInfo, function (error, data) {
            if (error) {
                console.log(error);
            } else {
                new Grid(data).draw();
            }
        });
    }
};


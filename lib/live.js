var schedule = require("./schedule");
var List = require("./list");
var ChannelFactory = require("./channel_factory");

module.exports = function (channel, date) {

    schedule(channel, date, function (error, games) {
        if (error) {
            console.log(error);
            return;
        }

        var list = List(games);
        list.start();

        var gameMap = {};
        games.forEach(function (game) {
            gameMap[game.id] = game;
        });

        list.on('keypress', function (key, item) {
            if (key.name == "return") {
                var gameInfo = gameMap[item];
                if (gameInfo.status == 1) {
                    list.stop();
                    live(gameMap[item]);
                }
            }
        });
    });


    function live(gameInfo) {
        process.stdin.setRawMode(false);
        var liveChannel = ChannelFactory.create(channel, gameInfo);
        liveChannel.startLive();
        liveChannel.on('data', function (data) {
            process.stdout.write((data.time || "") + " \033[0;34m " + (data.score || "") + "\033[0m " + data.content + "\n");
        });

        liveChannel.on("over", function () {
            process.stdout.write("game over \n");
        });
    }
};


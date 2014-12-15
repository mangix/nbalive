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
var loading = function (text) {
    console.log("\033[35m" + text + "\033[0m");
};

module.exports = function (channel, date) {
    loading("loading game info..");
    schedule(channel, date, function (error, games) {
        if (error) {
            console.log(error);
            return;
        }
        if (!games.length) {
            console.log("no games this day");
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
            var stdin = process.stdin;
            stdin.resume();
            stdin.setRawMode(true);
            stdin.on('keypress', function (chunk, key) {
                if (key && key.ctrl && key.name == 'c') {
                    process.exit();
                }
                else if (key.name === "b") {
                    list.stop();
                    list.draw();
                    list.start();
                }
            });
        });
    });


    function live(gameInfo) {
        process.stdin.setRawMode(false);
        loading("loading live data...");
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
        loading("loading statistic...");
        getStatistic(gameInfo, function (error, data) {
            if (error) {
                console.log(error);
            } else {
                var grid = new Grid(data);
                //config color
                grid.setColor(0, function (content) {
                    if (/主队|客队/.test(content)) {
                        return "magenta";
                    } else if (/首发|替补/.test(content)) {
                        return "yellow";
                    }
                });

                var count = grid.getColumnCount();
                for (var i = 2; i < count; i++) {
                    grid.setAlign(i, "right");
                }

                //find max data in each column
                var visitingStartRow = 0;
                var homeMax = [];
                var visitMax = [];
                data.forEach(function (row, i) {
                    if (row[0] && ~row[0].toString().indexOf("客队")) {
                        visitingStartRow = i;
                    }
                });
                for (var i = 0; i < count; i++) {
                    data.forEach(function (row, j) {
                        var arr;
                        var maxRow;
                        if (i < row.length && /^[\+|-]?\d+$/.test(row[i])) {
                            if (j < visitingStartRow) {
                                arr = homeMax;
                                maxRow = visitingStartRow - 2;
                            } else {
                                arr = visitMax;
                                maxRow = data.length - 2;
                            }
                            if (j < maxRow && (arr[i] === undefined || parseInt(row[i]) > parseInt(arr[i]))) {
                                arr[i] = row[i];
                            }
                        }
                    });
                }

                //config color

                for (var i = 1; i < count; i++) {
                    grid.setColor(i, function (content, row, column) {
                        if (/首发|时间|投篮|3分|罚球|前场|后场|篮板|助攻|犯规|抢断|失误|封盖|得分|(\+\/-)/.test(content)) {
                            return "yellow";
                        } else {
                            var targetMax;
                            if (row < visitingStartRow) {
                                targetMax = homeMax;
                            } else {
                                targetMax = visitMax;
                            }
                            if (content === targetMax[column]) {
                                return "green";
                            }
                        }
                    });
                }


                grid.draw();
            }
        });
    }
};


var List = require('term-list');
var Grid = require('term-grid');
var cell = require("./../util").cell;
var Scene = require("../scene");
var util = require("util");
var _ = require("underscore");

var schedule = require("../remote/schedule");

function fixScore(score) {
    var sc = score.split("-");
    sc[0] = cell(sc[0], 3, "right");
    sc[1] = cell(sc[1], 3, "left");
    console.log(sc[0]);
    return sc.join(" - ");
}

var MAP = {
    0: "SOON",
    2: "END",
    1: "LIVE"
};
var COLOR = {
    0: "yellow",
    2: "red",
    1: "green"
};
/**
 * List scene
 * @param games{Array}
 * */
var ListScene = module.exports = function (channel, date) {
    this.channel = channel;
    this.date = date;
    Scene.call(this);
};

util.inherits(ListScene, Scene);

_.extend(ListScene.prototype, {
    initGrid: function () {
        var games = this.games;
        var grid = this.grid = new Grid(games.map(function (game) {
            return [
                    MAP[game.status] || "",
                game.time,
                game.host,
                fixScore(game.score),
                game.visiting
            ];
        }));
        grid.setWidth([7, 6, 20, 17, 20]);
        grid.setAlign(["", "left", "right", "center"]);
        grid.setColor(0, function (content, i) {
            return COLOR[games[i].status];
        });
    },

    initList: function () {
        var games = this.games;
        var list = this.list = new List({ marker: '\033[36m› \033[0m', markerLength: 2 });
        var self = this;
        list.on('keypress', function (key, item) {
            if (key.name == "return") {
                var gameInfo = games.filter(function (game) {
                    return game.id == item;
                })[0];
                self.emit("choose", gameInfo);
            }
        });
        this.grid.compile().forEach(function (game, i) {
            list.add(games[i].id, game);
        });
    },
    start: function () {
        var self = this;
        this.api = schedule(this.channel, this.date, function (error, games) {
            if (error) {
                console.log(error);
                return;
            }
            if (!games.length) {
                console.log("no games this day");
                return;
            }
            self.games = games;
            self.initGrid();
            self.initList();
            self.list.start();
        });
    },
    stop: function () {
        this.list && this.list.stop();
        this.api && this.api.abort();
    }
});





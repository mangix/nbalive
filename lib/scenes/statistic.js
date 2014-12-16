/**
 * Live Scene
 * */

var util = require("util");
var Scene = require("../scene");
var _ = require("underscore");
var getStatistic = require("../remote/statistic");
var Grid = require("term-grid");

var StatisticScene = module.exports = function (gameInfo) {
    Scene.call(this);
    this.gameInfo = gameInfo;
};

util.inherits(StatisticScene, Scene);

_.extend(StatisticScene.prototype, {
    start: function () {
        var gameInfo = this.gameInfo;
        var self = this;
        this.api = getStatistic(gameInfo, function (error, data) {
            if (error) {
                console.log(error);
            } else {
                self.createGrid(data);

                self.createGridBaseInfo();
                self.configGridColor();
                self.configGridAlign();

                self.grid.draw();
                self.stop();
            }
        });
    },
    stop: function () {
        this.api && this.api.abort();
    },
    createGrid: function (data) {
        this.grid = new Grid(data);
    },
    createGridBaseInfo: function () {
        var grid = this.grid;
        var data = grid.data;

        //column count
        var count = this.gridColumnCount = grid.getColumnCount();

        //find max data in each column
        var visitingStartRow = this.visitingStartRow = 0;
        var homeMax = this.homeMax = [];
        var visitMax = this.visitMax = [];
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
    },
    configGridColor: function () {
        var grid = this.grid;

        var visitingStartRow = this.visitingStartRow;
        var homeMax = this.homeMax;
        var visitMax = this.visitMax;

        //config color
        grid.setColor(function (content, row, column) {
            if (column == 0) {
                if (/主队|客队/.test(content)) {
                    return "magenta";
                } else if (/首发|替补/.test(content)) {
                    return "yellow";
                }
            } else {
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
            }
        });
    },
    configGridAlign: function () {
        //config align
        for (var i = 2; i < this.gridColumnCount; i++) {
            this.grid.setAlign(i, "right");
        }
    }
});

/**
 * Live Action
 * */

var Action = require("../action");
var Statistic = require("../scenes/statistic");

module.exports = function (App, channel, date, gameInfo) {
    var action = new Action();

    action.add("back", "返回", function () {
        App.list(channel, date);
    });

    action.add("statistic", "查看当前技术统计", function () {
        var statistic = new Statistic(gameInfo).start();
        statistic.on("finish", function () {
            statistic.stop();
        });
    });

    return action;
};
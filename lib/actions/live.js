/**
 * Live Action
 * */

var Action = require("../action");

module.exports = function (App, channel, date, gameInfo) {
    var action = new Action();

    action.add("back", "返回", function () {
        App.list(channel, date);
    });

    action.add("statistic", "查看当前技术统计", function () {
        App.statistic(gameInfo);
    });

    return action;
};
/**
 * Live Action
 * */

var Action = require("../action");
var Statistic = require("../scenes/statistic");
var Load = require("../util").animateLoad;
module.exports = function (App, channel, date, gameInfo) {
    var action = new Action();

    action.add("back", "返回", function () {
        App.list(channel, date);
    });

    action.add("statistic", "查看当前技术统计", function () {
        var statistic = new Statistic(gameInfo);
        statistic.start();
        statistic.on("finish", function () {
            statistic.stop();
            process.stdin.setRawMode(true);
            Load.start();
        });
    });

    action.on("unknown",function(){
        process.stdin.setRawMode(true);
        Load.start();
    });

    return action;
};
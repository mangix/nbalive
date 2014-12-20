/**
 * Statistic Action
 * */

var Action = require("../action");

module.exports = function (App, channel, date, gameInfo) {
    var action = new Action();

    action.add("b", "返回", function () {
        App.list(channel, date);
    });

    return action;
};
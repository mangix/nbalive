var ListScene = require("./scenes/list");
var LiveScene = require("./scenes/live");
var StatisticScene = require("./scenes/statistic");
var LiveAction = require("./actions/live");
var StatisticAction = require("./actions/statistic");

var loading = require("./util").loading;


var App = module.exports = function (channel, date) {
    App.list(channel, date);
};

/**
 * switch scene
 * stop the current scene and start the incoming scene
 * */
App.switchScene = function (scene) {
    this.currentScene && this.currentScene.stop();
    this.currentScene = scene;
    scene.start();
};

/**
 * switch action
 * stop the current action and start the incoming action
 * */
App.switchAction = function (action) {
    this.currentAction && this.currentAction.stop();
    this.currentAction = action;
    action.start();
};

/**
 * initial
 * */
App.currentScene = null;
App.currentAction = null;

/**
 * live
 * */
App.live = function (channel, date, gameInfo) {
    var scene = new LiveScene(channel, gameInfo);
    App.switchScene(scene);

    var action = LiveAction(App, channel, date, gameInfo);
    App.switchAction(action);

    scene.channel.once("data", action.info.bind(action));

    loading("loading live data...");
};

/**
 * statistic
 * */
App.statistic = function (channel, date, gameInfo) {
    var scene = new StatisticScene(gameInfo);
    App.switchScene(scene);

    var action = StatisticAction(App, channel, date, gameInfo);
    App.switchAction(action);

    scene.on("finish", action.info.bind(action));
    loading("loading statistic...");
};

/**
 * game list
 * */
App.list = function (channel, date) {
    loading("loading game info..");

    var listScene = new ListScene(channel, date);

    App.switchScene(listScene);

    listScene.on('choose', function (gameInfo) {
        switch (gameInfo.status) {
            case 1:
                App.live(channel, date, gameInfo);
                break;
            case 2:
                App.statistic(channel, date, gameInfo);
                break;
        }
    });
};



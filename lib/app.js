var ListScene = require("./scenes/list");
var LiveScene = require("./scenes/live");
var StatisticScene = require("./scenes/statistic");


var loading = function (text) {
    console.log("\033[35m" + text + "\033[0m");
};


var App = module.exports = function (channel, date) {
    loading("loading game info..");

    var listScene = new ListScene(channel, date);

    App.switchScene(listScene);

    listScene.on('choose', function (gameInfo) {
        switch (gameInfo.status) {
            case 1:
                loading("loading live data...");
                App.switchScene(new LiveScene(channel, gameInfo));
                break;
            case 2:
                loading("loading statistic...");
                App.switchScene(new StatisticScene(gameInfo));
                break;
        }
    });


};

App.switchScene = function (scene) {
    this.currentScene && this.currentScene.stop();
    this.currentScene = scene;
    scene.start();
};
App.currentScene = null;


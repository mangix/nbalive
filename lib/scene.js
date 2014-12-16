/**
 * Scene Base
 * */
var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");

var Scene = module.exports = function () {
    EventEmitter.call(this);
};
require("util").inherits(Scene, EventEmitter);

_.extend(Scene.prototype, {
    constructor: Scene,

    /**
     * start the scene
     * @override
     * */
    start: function () {
    },

    /**
     * stop the scene
     * @override
     * */
    stop: function () {
    }
});
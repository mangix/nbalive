/**
 * Module Dependencies
 * */
var EventEmitter = require("events").EventEmitter;
var util = require("util");
var _ = require("underscore");

/**
 * Channel Base Class
 * Channel is an EventEmitter
 * @param gameInfo{Object} game info object
 * {
 *      gameId:"",
 *      host:"",
 *      visiting:""
 * }
 * */
var Channel = function (gameInfo) {
    this.gameInfo = gameInfo;
    EventEmitter.call(this);
};
util.inherits(Channel, EventEmitter);


_.extend(Channel.prototype, {
    constructor: Channel,
    /**
     * @override
     *  start live
     *  and should emit the 'data' event when fetched data each time
     *  data formats like {
     *      time:"",
     *      team:"",
     *      content:"",
     *      score:""
     *  }
     * */
    startLive: function () {
    },
    /**
     * @override
     * stop Live
     * */

    stopLive: function () {

    }
});


module.exports = Channel;
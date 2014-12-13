/**
 * Channel Factory
 * */
var channels = ["hupu"];
var DEFAULT_CHANNEL = channels[0];


var ChannelFactory = {

    create: function (channelName, gameInfo) {
        if (!~channels.indexOf(channelName)) {
            channelName = DEFAULT_CHANNEL;
        }

        return new (require("./channels/" + channelName))(gameInfo);
    }
};

module.exports = ChannelFactory;
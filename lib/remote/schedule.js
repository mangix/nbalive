/**
 * 获取某天的赛程
 * */

var api = require("./api");

module.exports = function (channel, date, cb) {
    api({
        url: "/schedule/fetch",
        data: {
            channel: channel,
            date: date
        },
        onSuc: function (data) {
            cb(null, data);
        },
        onError: function (err) {
            cb(err);
        }
    });
};
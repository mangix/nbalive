var api = require("./api");

module.exports = function (game, cb) {
    api({
        url: "/statistic/fetch",
        data: {
            id: game.id
        },
        onSuc: function (data) {
            cb(null, data);
        },
        onError: function (error) {
            cb(error);
        }
    });
};

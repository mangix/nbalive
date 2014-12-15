var request = require("request"),
    SERVER = require("./config").REMOTE_SERVER,
    API_URL = SERVER + "/statistic/fetch";

module.exports = function (game, cb) {
    var url = API_URL + ("?id=" + game.id);
    request(url, function (errors, response, body) {
        if (!errors && response.statusCode == 200) {
            var data;
            try {
                data = JSON.parse(body).data;
            } catch (e) {
                cb(e);
            }
            cb(null, data);
        } else {
            cb(new Error("api error"));
        }
    });
};

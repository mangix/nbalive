var request = require("request");
var SERVER = require("./config").REMOTE_SERVER;
var objToQuery = function (obj) {
    if (!obj) {
        return "";
    }
    var params = [];
    Object.keys(obj).forEach(function (key) {
        params.push(key + "=" + obj[key]);
    });
    params = params.join("&");
    return params ? "?" + params : "";

};
var NOOP = function () {
};

module.exports = function (options) {
    if (!options.url) {
        return;
    }
    var onSuc = options.onSuc || NOOP;
    var onError = options.onError || NOOP;

    var url = SERVER + options.url + objToQuery(options.data);

    return request(url, function (errors, response, body) {
        if (!errors && response.statusCode == 200) {
            var data;
            try {
                data = JSON.parse(body).data;
            } catch (e) {
                onError(new Error("api error"));
            }
            onSuc(data);
        } else {
            onError(new Error("api error"));
        }
    });
};

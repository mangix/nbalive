/**
 * hupu live
 * */
var request = require("request");

var util = require("util");
var Channel = require("../channel");
var HOST = "http://g.hupu.com/";

var escape = require('../util').escape;
var dom = require("../util").dom;

var ChannelHupu = module.exports = function (gameInfo) {
    this.channel = "hupu";
    this.sid = 0;
    this.s_count = 0;

    this.lastFetchTime = +new Date();
    this.fetchLag = 10000;
    Channel.call(this, gameInfo);

};

util.inherits(ChannelHupu, Channel);

ChannelHupu.prototype.startLive = function () {
    this.live();
};
ChannelHupu.prototype.stopLive = function () {
    //TODO
};

ChannelHupu.prototype.live = function () {
    var self = this;
    self.lastFetchTime = +new Date();
    this._buildLiveRequest(function (res) {
        if (self.isOver(res)) {
            self.emit("over");
        } else {
            self._parseLiveData(res, self.lagLive);
        }
    });
};
ChannelHupu.prototype.lagLive = function () {
    var self = this;
    if (+new Date() - self.lastFetchTime > self.fetchLag) {
        self.live();
    } else {
        setTimeout(function () {
            self.live();
        }, self.fetchLag - ( +new Date() - self.lastFetchTime));
    }
};

/**
 * is live finished?
 * */
ChannelHupu.prototype.isOver = function (res) {
    return res === "over";
};

/**
 * resolve the http response
 * @param res{String} http response body
 * @param cb{Function} called when finished
 * */
ChannelHupu.prototype._parseLiveData = function (res, cb) {
    var self = this;
    dom(res, "table", function (errors, doc, window) {
        if (errors) {
            return;
        }
        var trs = doc.querySelectorAll("tr");
        var newSid;
        if (trs.length) {
            trs = Array.prototype.slice.call(trs, 0).reverse();
            newSid = trs[trs.length - 1].getAttribute("sid");
            if (newSid && newSid != self.sid) {
                self.sid = newSid;
                self.s_count += trs.length;
                trs.forEach(function (tr) {
                    var tds = tr.querySelectorAll("td");
                    if (tds.length == 4) {
                        self.emit("data", {
                            time: escape(tds[0].innerHTML),
                            team: escape(tds[1].innerHTML),
                            content: escape(tds[2].innerHTML),
                            score: escape(tds[3].innerHTML)
                        });
                    } else if (tds.length == 1) {
                        self.emit("data", {
                            content: escape(tds[0].innerHTML)
                        });
                    }
                });
            }
        }
        cb.call(self);
    });
};

/**
 * build http request to hupu live
 * @param cb{Function} called when request success
 * */
ChannelHupu.prototype._buildLiveRequest = function (cb) {
    var self = this;
    request({
        url:this._buildLiveRequestUrl(),
        headers:{
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53'
        }
    }, function (error, response, body) {
        if (error) {
            self.emit("error", error);
            self.lagLive();
        } else {
            if (response.statusCode == 200) {
                cb(body);
            } else {
                self.emit("error", new Error("remote error " + response.statusCode));
                self.lagLive();
            }
        }
    });
};


/**
 * build hupu live url
 * @return {String}
 * */
ChannelHupu.prototype._buildLiveRequestUrl = function () {
    var gameInfo = this.gameInfo;
    var data = {
        sid: this.sid,
        s_count: this.s_count,
        match_id: gameInfo.gameId,
        homeTeamName: encodeURIComponent(gameInfo.host),
        awayTeamName: encodeURIComponent(gameInfo.visiting)
    };
    var url  = HOST + "/node/playbyplay/matchLives" + Object.keys(data).reduce(function (sum, current) {
        return sum + current + "=" + data[current] + "&";
    }, "?");

//    console.log(url)

    return url;
};

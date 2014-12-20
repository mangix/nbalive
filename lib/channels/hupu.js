/**
 * hupu live
 * */

var request = require("request");

var util = require("util");
var Channel = require("../channel");
var HOST = "http://g.hupu.com/";

var cheerio = require("cheerio");

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
    clearTimeout(this.timer);
    this.request.abort();
};

ChannelHupu.prototype.live = function () {
    var self = this;
    self.lastFetchTime = +new Date();
    self.request = self._buildLiveRequest(function (res) {
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
        self.timer = setTimeout(function () {
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
    var $ = cheerio.load("<table>" + res + "</table>");

    var trs = $("tr");
    var newSid , datas = [];
    if (trs.length) {
        newSid = trs.eq(0).attr("sid");
        if (newSid && newSid != self.sid) {
            self.sid = newSid;
            self.s_count += trs.length;
            trs.each(function (i, tr) {
                var tds = $(tr).find("td");
                if (tds.length == 4) {
                    datas.unshift({
                        time: $(tds[0]).text(),
                        team: $(tds[1]).text(),
                        content: $(tds[2]).text(),
                        score: $(tds[3]).text()
                    });
                } else if (tds.length == 1) {
                    datas.unshift({
                        content: $(tds[0]).text()
                    });
                }
            });
//            datas.forEach(function (data) {
            self.emit('data', datas);
//            });
        }
    }else{
        self.emit('empty');
    }
    cb.call(self);
};

/**
 * build http request to hupu live
 * @param cb{Function} called when request success
 * */
ChannelHupu.prototype._buildLiveRequest = function (cb) {
    var self = this;
    return request({
        url: this._buildLiveRequestUrl(),
        headers: {
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
    var url = HOST + "/node/playbyplay/matchLives" + Object.keys(data).reduce(function (sum, current) {
        return sum + current + "=" + data[current] + "&";
    }, "?");

    return url;
};

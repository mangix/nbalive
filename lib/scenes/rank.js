var request = require("request");
var cheerio = require("cheerio");
var Grid = require("term-grid");

var Scene = require("../scene");
var util = require("util");
var _ = require("underscore");

var URL = "http://g.hupu.com/nba/standing";


var RankScene = module.exports = function () {
    Scene.call(this);
};

util.inherits(RankScene, Scene);

_.extend(RankScene.prototype, {

    start: function () {
        var self = this;
        this.api = request(URL, function (error, response, body) {
            if (!error && response && response.statusCode == 200) {
                var $ = cheerio.load(body);
                var twoTables = [
                    [],
                    []
                ];
                var index = -1;
                $('.rank_data .players_table tr').each(function (i, tr) {
                    tr = $(tr);
                    if (tr.hasClass('linglei')) {
                        index++;
                    }
                    if (index < 0) {
                        return;
                    }
                    var row = [];
                    twoTables[index].push(row);
                    tr.find("td").each(function (j, td) {
                        row.push($(td).text().trim().replace("\n", ""));
                    });
                });

                self.draw(twoTables);

            } else {
                console.log("data error");
            }

        });
    },
    stop: function () {
        this.api && this.api.abort();
    },
    draw: function (data) {
        data.forEach(function (table) {
            var grid = new Grid(table);
            grid.setColor(function (content, i, j) {
                if (i == 0) {
                    return "magenta";
                }
                if (i == 1) {
                    return "yellow";
                }
            });
            grid.setWidth(1, 20);
            var count = grid.getColumnCount();
            for (var i = 2; i < count; i++) {
                grid.setAlign(i,"center");
            }
            grid.draw();
        });
    }
});

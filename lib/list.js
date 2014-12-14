var List = require('term-list');
var Grid = require('term-grid');
var cell = require("./util").cell;

function fixScore(score) {
    var sc = score.split("-");
    sc[0] = cell(sc[0], 3, "right");
    sc[1] = cell(sc[1], 3, "left");
    console.log(sc[0]);
    return sc.join(" - ");
}
/**
 * create list
 * @param games{Array}
 * */
module.exports = function (games) {
    var list = new List({ marker: '\033[36m› \033[0m', markerLength: 2 });
    games.forEach(function (game) {
        var status = "";
        switch (game.status) {
            case 0 :
                status = "\033[33mSOON   \033[0m";
                break;
            case 2 :
                status = "\033[31mEND    \033[0m";
                break;
            case 1:
                status = "\033[32mLIVE   \033[0m";
                break;
        }
        list.add(game.id,
            [
                status,
                cell(game.time, 6, "left"),
                cell(game.host, 20, "right"),
                cell(fixScore(game.score), 17, "center"),
                cell(game.visiting, 20, "left")
            ].join("")
        );
    });

    return list;
};




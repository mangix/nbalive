var List = require('term-list');
var cell = require("./util").cell;

function fixScore(score) {
    var sc = score.split("-");
    sc[0] = cell(sc[0], 3, "right", false);
    sc[1] = cell(sc[1], 3, "left", false);
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
        list.add(game.id,
            [
                cell(game.time, 6, "left"),
                cell(game.host, 20, "right"),
                cell(fixScore(game.score), 18, "center"),
                cell(game.visiting, 20, "left")
            ].join("")
        );
    });

    return list;
};




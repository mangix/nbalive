var cell = require("./util").cell,
    _ = require("underscore"),
    request = require("request"),
    SERVER = require("./remote/config").REMOTE_SERVER,
    API_URL = SERVER + "/statistic/fetch";

function formatStatisticData(statisticObj){
    var rawData = JSON.parse(statisticObj[0].data);
        result = '';

        _.each(rawData, function(row, i){
            _.each(row, function(col, j){
                var content = col;
                if(j === 0){
                    content = cell(content, 22, 'left');
                }
                else{
                    content = cell(content, 7, 'left');
                }
                result += content;  
            });
            result += '\n';
        });

    return result;

};
module.exports = function (game) {
    API_URL += ("?id=" + game.id);
    request(API_URL, function (errors, response, body) {
        if (!errors && response.statusCode == 200) {
            var statisticData;
            try {
                statisticData = JSON.parse(body).data;
            } catch (e) {
                console.log("api error");
            }
            console.log(formatStatisticData(statisticData));
        } else {
            console.log("api error");
        }
    });
};

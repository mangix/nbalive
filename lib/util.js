/**
 * filter html tag in string
 * */
exports.escape = function (str) {
    return str ? str.replace(/<[/]?\w+>/g, ""):""
};


/**
 * cell
 * */
exports.cell = function (content, width, align) {
    var len = countCharacters(content);
    if (len >= width) {
        return content;
    }

    function countCharacters(str) {
        var totalCount = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                totalCount++;
            }
            else {
                totalCount += 2;
            }
        }
        return totalCount;
    }

    function empty(size) {
        return size <= 1 ? " " : (new Array(size)).join(" ");
    }

    switch (align) {
        case "right" :
            return empty(width - len) + content;
        case "center":
            return empty(Math.floor((width - len) / 2)) + content + empty(Math.round((width - len) / 2));
        default :
            return content + empty(width - len);
    }
};

var fixZero = function (num) {
    return num < 10 ? "0" + num : num;
};
/**
 * date format
 * */
exports.format = function (date) {
    return date.getFullYear() + "-" + fixZero(date.getMonth() + 1) + "-" + fixZero(date.getDate());
};


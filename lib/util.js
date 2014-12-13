/**
 * filter html tag in string
 * */
exports.escape = function (str) {
    return str.replace(/<[/]?\w+>/g, "")
};


/**
 * jsdom
 * */
var jsdom = require("jsdom");
exports.dom = function (html, wrapTag, cb) {
    if (wrapTag) {
        html = "<" + wrapTag + ">" + html + "</" + wrapTag + ">";
    }
    jsdom.env(html, function (err, window) {
        if (err) {
            cb(err);
        } else {
            cb(null, window.document, window);
        }
    });
};

/**
 * cell
 * */
exports.cell = function (content, width, align, isDouble) {
    if (content.length >= width) {
        return content;
    }
    function empty(size) {
        size *= (isDouble ? 2 : 1);

        return size <= 1 ? " " : (new Array(size)).join(" ");
    }

    switch (align) {
        case "right" :
            return empty(width - content.length) + content;
        case "center":
            return empty(Math.floor((width - content.length) / 2)) + content + empty(Math.round((width - content.length) / 2));
        default :
            return content + empty(width - content.length);
    }
};

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
exports.cell = function (content, width, align) {
    if (content.length >= width) {
        return content;
    }

    function countCharacters(str)
    {
        var totalCount = 0;
        for (var i=0; i<str.length; i++)
        {
            var c = str.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f))
            {
                totalCount++;
            }
            else
            {     
                totalCount+=2;
            }
        }
        return totalCount;
    }

    function empty(size) {

        return size <= 1 ? " " : (new Array(size)).join(" ");
    }

    var len = countCharacters(content);

    switch (align) {
        case "right" :
            return empty(width - len) + content;
        case "center":
            return empty(Math.floor((width - len) / 2)) + content + empty(Math.round((width - len) / 2));
        default :
            return content + empty(width - len);
    }
};
